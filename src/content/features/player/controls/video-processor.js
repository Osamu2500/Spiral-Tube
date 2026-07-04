export default class VideoProcessor {
  constructor() {
    this.processors = [];
  }

  addProcessor(processor) {
    this.processors.push(processor);
  }

  async process(video, options = {}) {
    if (!this.processors.length) {
      throw new Error('No processors added');
    }

    let result = video;
    for (const processor of this.processors) {
      result = await processor(result, options);
    }
    return result;
  }
}