"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewCreatedPublisher = void 0;
const common_1 = require("@akbar0102/common");
class ReviewCreatedPublisher extends common_1.Publisher {
    constructor() {
        super(...arguments);
        this.subject = common_1.Subject.ReviewCreated;
    }
}
exports.ReviewCreatedPublisher = ReviewCreatedPublisher;
