class Article {
  constructor() {
    this.id = 0;
    this.title = '';
    this.summary = '';
    this.source = '';
    this.article_url = '';
    this.image_url = '';
    this.visible = false;
    this.created_at = Date.now();
    this.updated_at = Date.now();
    this.user_id = null;
  }

  static get tableName() {
    return 'articles';
  }

  static createArticle(params) {

    const article = new Article();

    if (params.id) {
      article.id = params.id;
    }

    if (params.title) {
      article.title = params.title;
    }

    if (params.summary) {
      article.summary = params.summary;
    }

    if (params.source) {
      article.source = params.source;
    }

    if (params.article_url) {
      article.article_url = params.article_url;
    }

    if (params.image_url) {
      article.image_url = params.image_url;
    }

    if (params.visible) {
      article.visible = params.visible;
    }

    if (params.created) {
      article.created_at = params.created;
    }

    if (params.updated) {
      article.updated_at = params.updated;
    }
    if (params.user_id) {
      article.user_id = params.user_id;
    }

    return article;
  }
}

module.exports = Article;
