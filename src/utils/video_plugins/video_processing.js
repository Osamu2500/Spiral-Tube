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

    let result;
    for (const select of this.controls) {
      result = await select(video, options);
    }
    return result;
  }
}