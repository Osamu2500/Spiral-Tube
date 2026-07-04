export default class VideoProcessor {
  constructor() {
    this.controls = [];
  }

  addControl(select) {
    this.controls.push(select);
  }

  async processVideo(video, options) {
    if (!this.controls.length) {
      throw new Error('No controls added to processor');
    }

    return this.controls.reduce((result, select) => {
      result = await select(video, options);
      return Promise.resolve(result);
    }, Promise.resolve());
  }
}</script>