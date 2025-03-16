document.addEventListener('alpine:init', () => {
    Alpine.data('quiz', () => ({
        step: 'start',
        category: 'any',
        difficulty: 'any',
        numQuestions: 3,
        questions: [],
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        loading: false,
        categories: [
            { id: 'any', name: 'Any Category' },
            { id: '9', name: 'General Knowledge' },
            { id: '10', name: 'Entertainment: Books' },
            { id: '11', name: 'Entertainment: Film' },
            { id: '12', name: 'Entertainment: Music' },
            { id: '13', name: 'Entertainment: Musicals & Theatres' },
            { id: '14', name: 'Entertainment: Television' },
            { id: '15', name: 'Entertainment: Video Games' },
            { id: '16', name: 'Entertainment: Board Games' },
            { id: '17', name: 'Science & Nature' },
            { id: '18', name: 'Science: Computers' },
            { id: '19', name: 'Science: Mathematics' },
            { id: '20', name: 'Mythology' },
            { id: '21', name: 'Sports' },
            { id: '22', name: 'Geography' },
            { id: '23', name: 'History' },
            { id: '24', name: 'Politics' },
            { id: '25', name: 'Art' },
            { id: '26', name: 'Celebrities' },
            { id: '27', name: 'Animals' },
            { id: '28', name: 'Vehicles' },
            { id: '29', name: 'Entertainment: Comics' },
            { id: '30', name: 'Science: Gadgets' },
            { id: '31', name: 'Entertainment: Japanese Anime & Manga' },
            { id: '32', name: 'Entertainment: Cartoon & Animations' }
        ],
        difficulties: [
            { id: 'any', name: 'Any Difficulty' },
            { id: 'easy', name: 'Easy' },
            { id: 'medium', name: 'Medium' },
            { id: 'hard', name: 'Hard' }
        ],
        async startQuiz() {
            this.loading = true;
            let apiUrl = `https://opentdb.com/api.php?amount=${this.numQuestions}`;
            if (this.category !== 'any') apiUrl += `&category=${this.category}`;
            if (this.difficulty !== 'any') apiUrl += `&difficulty=${this.difficulty}`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                this.questions = data.results.map(q => ({
                    ...q,
                    answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
                }));
                this.step = 'quiz';
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                this.loading = false;
            }
        },
        checkAnswer(answer) {
            if (this.loading) return;
            this.loading = true;
            this.selectedAnswer = answer;
            
            if (answer === this.questions[this.currentQuestion].correct_answer) {
                this.score++;
            }
            
            setTimeout(() => {
                if (this.currentQuestion < this.questions.length - 1) {
                    this.currentQuestion++;
                    this.selectedAnswer = null;
                } else {
                    this.step = 'results';
                }
                this.loading = false;
            }, 1000);
        },
        resetQuiz() {
            this.step = 'start';
            this.questions = [];
            this.currentQuestion = 0;
            this.score = 0;
            this.selectedAnswer = null;
        },
        decodeHtml(html) {
            const txt = document.createElement('textarea');
            txt.innerHTML = html;
            return txt.value;
        },
        getAnswerClasses(answer) {
            if (this.selectedAnswer === null) {
                return 'bg-white hover:bg-gray-50';
            }
            if (answer === this.questions[this.currentQuestion].correct_answer) {
                return 'bg-green-100 border-green-500';
            }
            if (answer === this.selectedAnswer) {
                return 'bg-red-100 border-red-500';
            }
            return 'bg-white';
        }
    }))
});
