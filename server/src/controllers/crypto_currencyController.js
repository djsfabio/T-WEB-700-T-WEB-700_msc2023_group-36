const {checkUser} = require("./baseController");
const userModel = require('../models/userModel');
const CryptoCurrencyModel = require('../models/cryptoCurrencyModel');
const CoinGecko = require('coingecko-api');
const {axiosInstance} = require('../service/axios');

//------------------------------------------------------------------------------
//TODO create a service for this API call
const CoinGeckoClient = new CoinGecko();
//------------------------------------------------------------------------------

exports.getCryptosAll = async (request, response, callback) => {

    let cryptoCurrencies = [];
    try {
        // Get details from API and build the response data
        cryptoCurrencies = await axiosInstance.get(`/coins`);
        response.status(200).json({
            message: 'CryptoCurrency fetched successfully',
            data: cryptoCurrencies.data.data
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not found ' + e.message,
            data: cryptoCurrencies
        });
    }
}

exports.getCryptoCurrencies = async (request, response, callback) => {
    let {cmids} = request.query;

    let cryptoCurrencies_temp = [];
    let cryptoCurrencies = [];
    try {
        if (typeof cmids === 'undefined') {
            cryptoCurrencies_temp = await CryptoCurrencyModel.find({});
        } else {
            cmids = cmids.split(',');
            cryptoCurrencies_temp = await CryptoCurrencyModel.find({_id: {$in: cmids}});
        }
        // Get details from API and build the response data
        for (const cryptoCurrency of cryptoCurrencies_temp) {
            let cryptoCurrency_api = await axiosInstance.get(`/coin/${cryptoCurrency.code}`)
            // TODO - to return just updated_at
            // TODO - select only the fields we need
            cryptoCurrencies.push({
                ...cryptoCurrency._doc,
                ...cryptoCurrency_api.data.data
            });
        }

        response.status(200).json({
            message: 'CryptoCurrency fetched successfully',
            data: cryptoCurrencies
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not found ' + e.message
        });
    }
}

exports.getHistory = async (request, response, callback) => {
    const currentUser = await checkUser(request, response);

    //Visitor
    if (!currentUser) {
        response.status(401).json({
            message: 'Unauthorized'
        });
        return;
    }

    try {
        const path =  request.path.split('/');
        const cmid = path[1];
        //TODO - to do some thing here according to the path
        let period = '';
        switch (path[path.length - 1]) {
            //daily, hourly or minute
            case 'weekly':
                period  = '7d';
                break;
            case 'monthly':
                period  = '30d';
                break;
            case 'daily':
            default:
                period = '7d';
                break;
        }
        const cryptoCurrency_temp = await CryptoCurrencyModel.findById(cmid);
        const coins_history = await axiosInstance.get(`/coin/${cryptoCurrency_temp.code}/history/${period}`);

        // Remove User password
        if (cryptoCurrency_temp.author) {
            cryptoCurrency_temp.author.password = '';
        }

        response.status(200).json({
            message: 'CryptoCurrency fetched successfully',
            data: {
                cryptoCurrency: cryptoCurrency_temp,
                coins: coins_history.data
            }
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not found ' + e.message
        });
    }
}

exports.getCryptoCurrency = async (request, response, callback) => {
    const user = await checkUser(request, response);

    if (!user) {
        response.status(401).json({
            message: 'You have to be logged in to access this page'
        });
        return;
    }

    try {
        // Find it from the database
        const cryptoCurrency_temp = await CryptoCurrencyModel.findById(request.params.cmid);
        if (!cryptoCurrency_temp) {
            response.status(404).json({
                message: 'CryptoCurrency not found'
            });
            return;
        }
        // TODO - To remove or do something: test ping is successful
        let crypto = await CoinGeckoClient.ping();
        let cryptoCurrency = null;
        if (cryptoCurrency_temp && cryptoCurrency_temp.code) {
            const coin = await axiosInstance.get(`/coin/${cryptoCurrency_temp.code}`);
            cryptoCurrency = {
                ...cryptoCurrency_temp._doc,
                ...coin.data.data
            };
        } else {
            cryptoCurrency = {
                ...cryptoCurrency_temp._doc
            };
        }
        // if (cryptoCurrency_temp && cryptoCurrency_temp.author) {
        //     cryptoCurrency_temp.author.password = '';
        // }
        response.status(200).json({
            message: 'CryptoCurrency fetched successfully',
            data: cryptoCurrency,
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not found ' + e.message
        });
    }
}

exports.createCryptoCurrency = async (request, response, callback) => {
    const admin = checkUser(request, response);
    if (admin.role !== 'ROLE_ADMIN') {
        return response.status(401).json({
            message: 'You are not authorized to create a CryptoCurrency'
        });
    }
    try {
        const cryptoCurrency = await CryptoCurrencyModel.create(request.body);
        await userModel.findByIdAndUpdate(admin.id, {$push: {crypto_currencies: cryptoCurrency.id}});
        await CryptoCurrencyModel.findByIdAndUpdate(cryptoCurrency.id, {$push: {author: admin.id}});

        response.status(201).json({
            message: 'CryptoCurrency created successfully',
            data: cryptoCurrency
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not created. ' + e.message
        });
    }
}

exports.updateCryptoCurrency = async (request, response, callback) => {
    const admin = checkUser(request, response);
    if (admin.role !== 'ROLE_ADMIN') {
        return response.status(401).json({
            message: 'You are not authorized to create a CryptoCurrency'
        });
    }

    try {
        //TODO - to update currency
        const cryptoCurrency = await CryptoCurrencyModel.findByIdAndUpdate(request.params.cmid, request.body, {
            new: true,
            runValidators: true
        });
        response.status(201).json({
            message: 'CryptoCurrency updated successfully',
            data: cryptoCurrency
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not updated. ' + e.message
        });
    }
}

exports.deleteCryptoCurrency = async (request, response, callback) => {
    const admin = checkUser(request, response);
    if (!admin || admin.role !== 'ROLE_ADMIN') {
        return response.status(401).json({
            message: 'You are not authorized to create a CryptoCurrency'
        });
    }

    try {
        //TODO to remove currency from User
        await CryptoCurrencyModel.findByIdAndDelete(request.params.cmid);
        response.status(200).json({
            message: 'CryptoCurrency deleted successfully',
        });
    } catch (e) {
        response.status(404).json({
            message: 'CryptoCurrency not deleted.'
        });
    }
}
