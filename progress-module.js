/**
 * Dynamic Progress Bar Module
 *
 * Calculates progress based on remaining questions in real-time.
 * Each question consumes an equal portion of the REMAINING progress bar.
 * Assumes minimum 20 questions to prevent rapid advancement during initial questions.
 *
 * Algorithm:
 * - effectiveRemaining = max(actualRemaining, minQuestions - questionsAnswered)
 * - progressIncrement = remainingProgress / effectiveRemaining
 *
 * Example with 20 minimum questions:
 * - Q1: effectiveRemaining = max(19, 20-1) = 19, progress = 1/20 of 100% = 5%
 * - Q2: effectiveRemaining = max(18, 20-2) = 18, progress = 5% + (1/19 of 95%) = ~10%
 * - ... and so on ...
 * - Completion: questionsRemaining = 0, progress = 100%
 *
 * This ensures smooth progression that never goes backward and
 * automatically adjusts to different tier path lengths.
 *
 * Usage:
 * - Initialize: new ProgressBar('progressBar', debug=false, minQuestions=20)
 * - Update: progressBar.updateProgress(sections.length - currentStep - 1)
 */

class ProgressBar {
    constructor(barElementId, debug = false, minQuestions = 20) {
        this.barElement = document.getElementById(barElementId);
        this.currentProgress = 0; // 0 to 100
        this.questionsAnswered = 0;
        this.minQuestions = minQuestions;
        this.debug = debug;

        if (this.debug) {
            console.log('🎨 Progress Bar Module initialized (min questions:', minQuestions + ')');
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
            // Use the greater of actual remaining questions or minimum assumption
            // This prevents progress from advancing too quickly during initial questions
            const effectiveRemaining = Math.max(questionsRemaining, this.minQuestions - this.questionsAnswered);

            // Calculate how much of the remaining bar this question should consume
            const remainingProgress = 100 - this.currentProgress;
            const progressIncrement = remainingProgress / effectiveRemaining;

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
                effectiveRemaining: questionsRemaining > 0 ? Math.max(questionsRemaining, this.minQuestions - this.questionsAnswered + 1) : 0,
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
