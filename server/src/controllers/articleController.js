const articleModel = require('../models/articleModel');
const {checkUser} = require("./baseController");
const userModel = require("../models/userModel");
const {axiosInstanceNew} = require("../service/axios");

exports.getArticles = async (request, response, callback) => {
    const currentUser = await checkUser(request, response);
    let  articles = null;
    let  articles_from_api = [];
    let keywords = Object.values(request.query).join(', ');
    try {
        articles = await articleModel.find({
            visible: true
        }).sort({
            updated_at: 'desc'
        })
        if (!currentUser) {
            articles = articles.filter(article => article.visible === true);
            if (articles) {
                articles.forEach(article => {
                    articles_from_api.push({
                        id: article.id,
                        title: article.title,
                        article_url: article.article_url,
                        image_url: article.image_url
                    });
                });
            }
        } else {
            //TODO-  this part is not clearly defined or understood
            for (const article of articles) {
                const params = {
                    q: keywords,
                    count: '3',
                    setLang: 'FR',
                    freshness: 'Day',
                    originalImg: 'true',
                    textFormat: 'Raw',
                    safeSearch: 'Off'
                }
                let article_from_api = await axiosInstanceNew.get('/news/search', {
                    params
                });
                articles_from_api.push({
                    id: article_from_api.data.value[0]?.name,
                    title: article_from_api.data.value[0]?.name,
                    description: article_from_api.data.value[0]?.description,
                    url: article_from_api.data.value[0]?.url,
                    image: article_from_api.data.value[0]?.image?.contentUrl
                });
            }
        }

        response.status(200).json({
            message: 'Article fetched successfully',
            data : articles_from_api
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not found ' + e.message
        });
    }
}

exports.getArticle = async (request, response, callback) => {
    try {
        const article = await articleModel.findById(request.params.id);

        article.keywords = '';
        response.status(200).json({
            message: 'Article fetched successfully',
            data: {
                id: article.id,
                title: article.title,
                summary: article.summary,
                source: article.source,
                date: article.updated_at,
                article_url: article.article_url,
                image_url: article.image_url,
            }
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not found ' + e.message
        });
    }
}

exports.createArticle = async (request, response, callback) => {
    // TODO - many Repeat - Have to optimize
    const admin = checkUser(request, response);
    if (admin.role !== 'ROLE_ADMIN') {
        return response.status(401).json({
            message: 'You are not authorized to create a Article'
        });
    }

    try {
        const article = await articleModel.create(request.body);
        await userModel.findByIdAndUpdate(admin.id, {$push: {articles: article.id}});
        await articleModel.findByIdAndUpdate(article.id, {$push: {author: admin.id}});

        response.status(201).json({
            message: 'Article created successfully',
            data: article
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not created. ' + e.message
        });
    }
}

exports.updateArticle = async (request, response, callback) => {
    const currentUser = await checkUser(request, response);

    //Visitor
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
        response.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }
    try {
        const article = await articleModel.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        });
        response.status(201).json({
            message: 'Article updated successfully',
            data: article
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not updated. ' + e.message
        });
    }
}

exports.deleteArticle = async (request, response, callback) => {

    const currentUser = await checkUser(request, response);
    //Visitor
    if (!currentUser || currentUser.role !== 'ROLE_ADMIN') {
        response.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    try {
        // I set listener on articleModel to delete Article from User
        await articleModel.findByIdAndDelete(request.params.id);
        response.status(200).json({
            message: 'Article deleted successfully',
        });
    } catch (e) {
        response.status(404).json({
            message: 'Article not deleted. ' + e.message
        });
    }
}
