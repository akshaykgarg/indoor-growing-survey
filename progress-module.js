/**
 * Dynamic Progress Bar Module
 *
 * Calculates progress based on remaining questions in real-time.
 * Each question consumes an equal portion of the REMAINING progress bar.
 *
 * Example with 20 total sections:
 * - Q1 rendered: questionsRemaining = 19, progress = 1/20 of 100% = 5%
 * - Q2 rendered: questionsRemaining = 18, progress = 5% + (1/19 of 95%) = ~10%
 * - Q3 rendered: questionsRemaining = 17, progress = ~10% + (1/18 of 90%) = ~15%
 * - ... and so on ...
 * - Completion: questionsRemaining = 0, progress = 100%
 *
 * This ensures smooth progression that never goes backward and
 * automatically adjusts to different tier path lengths.
 *
 * Usage: Call updateProgress(sections.length - currentStep - 1) on each render
 */

class ProgressBar {
    constructor(barElementId, debug = false) {
        this.barElement = document.getElementById(barElementId);
        this.currentProgress = 0; // 0 to 100
        this.questionsAnswered = 0;
        this.debug = debug;

        if (this.debug) {
            console.log('🎨 Progress Bar Module initialized');
        }
    }

    /**
     * Calculate and update progress after answering a question
     * @param {number} questionsRemaining - Number of questions left AFTER current question
     *                                      Pass 0 for the final completion screen to reach 100%
     */
    updateProgress(questionsRemaining) {
        if (questionsRemaining <= 0) {
            // Survey complete
            this.currentProgress = 100;
        } else {
            // Calculate how much of the remaining bar this question should consume
            const remainingProgress = 100 - this.currentProgress;
            const progressIncrement = remainingProgress / questionsRemaining;

            this.currentProgress += progressIncrement;

            // Ensure we never exceed 100%
            this.currentProgress = Math.min(this.currentProgress, 100);
        }

        this.questionsAnswered++;

        // Update the visual bar
        this.render();

        if (this.debug) {
            console.log(`📊 Progress Update:`, {
                questionsAnswered: this.questionsAnswered,
                questionsRemaining,
                progressIncrement: questionsRemaining > 0 ? ((100 - this.currentProgress + (100 - this.currentProgress) / questionsRemaining) / questionsRemaining).toFixed(2) + '%' : 'N/A',
                currentProgress: this.currentProgress.toFixed(2) + '%'
            });
        }
    }

    /**
     * Render the progress bar visually
     */
    render() {
        if (this.barElement) {
            this.barElement.style.width = this.currentProgress.toFixed(2) + '%';
        }
    }

    /**
     * Reset progress to 0%
     */
    reset() {
        this.currentProgress = 0;
        this.questionsAnswered = 0;
        this.render();

        if (this.debug) {
            console.log('🔄 Progress Bar Reset');
        }
    }

    /**
     * Get current progress percentage
     */
    getProgress() {
        return this.currentProgress;
    }

    /**
     * Set progress to a specific value (use sparingly)
     */
    setProgress(percentage) {
        this.currentProgress = Math.min(Math.max(percentage, 0), 100);
        this.render();
    }
}

// Export for use in survey
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressBar;
}
