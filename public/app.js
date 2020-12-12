const app = new Vue({
  el: '#app',
  data: {
    url: '',
    slug: '',
    created: null,
  },
  methods: {
    async createUrl() {
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: this.slug.length > 0 ?
          JSON.stringify({
            url: this.url,
            slug: this.slug
          }) :
          JSON.stringify({
            url: this.url
          })
      });
      this.created = await response.json();
    }
  }
})