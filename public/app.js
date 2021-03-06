const app = new Vue({
  el: '#app',
  data: {
    url: '',
    slug: '',
    created: null,
    errorMessage: '',
  },
  methods: {
    async createUrl() {
      this.errorMessage = '';
      this.created = '';

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
      const result = await response.json();
      if (result.message) {
        const slugAlreadyUsedError = result.message.includes('use');
        if (slugAlreadyUsedError) {
          this.created = result;
        } else {
          this.errorMessage = result.message;
        }
      } else {
        this.created = result;
      }
    },
    copyToClipboard() {
      const textToCopy = `http://a-short-url.herokuapp.com/${this.slug ? this.slug : this.created.slug}`;

      navigator.clipboard.writeText(textToCopy).then(() => {
        window.alert('Link has been copied to your clipboard!');
      }, () => {
        console.log('NOPE!');
      });
    }
  }
});