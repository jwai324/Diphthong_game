import { useState } from 'react';

export default function LandingScreen({ onEnter }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const response = await fetch('/api/beta-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setEmail(''), 1000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-white font-display text-ink overflow-y-auto">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">🎮 Diphthong Dash</div>
          <button
            onClick={onEnter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition text-sm sm:text-base"
          >
            Play Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Phonics Practice That Actually Works
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Diphthong Dash turns reading practice into an addictive game. Your kid asks to play — without being asked. Real progress in weeks, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onEnter}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Play Free Now
            </button>
            <a
              href="#features"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 sm:py-24 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Three Ways to Learn Phonics
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {/* DASH Mode */}
            <div className="bg-blue-50 p-6 sm:p-8 rounded-lg border border-blue-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">DASH</h3>
              <p className="text-gray-700 mb-4">
                Timed challenges that make learning competitive. Pick the right vowel team in seconds.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Timed rounds (1-5 min)</li>
                <li>✓ Multiple difficulty levels</li>
                <li>✓ Instant feedback</li>
                <li>✓ High-score tracking</li>
              </ul>
            </div>

            {/* LEARNING Mode */}
            <div className="bg-green-50 p-6 sm:p-8 rounded-lg border border-green-200">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">LEARNING</h3>
              <p className="text-gray-700 mb-4">
                Untimed exploration. Audio guides kids through each vowel team at their own pace.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Full word audio (TTS)</li>
                <li>✓ Isolated pattern sounds</li>
                <li>✓ Visual pattern matching</li>
                <li>✓ No time pressure</li>
              </ul>
            </div>

            {/* HEART WORDS Mode */}
            <div className="bg-pink-50 p-6 sm:p-8 rounded-lg border border-pink-200">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">HEART WORDS</h3>
              <p className="text-gray-700 mb-4">
                Sight words mastery. Smart distractors help catch gaps in memory.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ Irregular patterns (sight words)</li>
                <li>✓ AI-generated distractors</li>
                <li>✓ Spaced repetition</li>
                <li>✓ Progress tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section id="about" className="py-16 sm:py-24 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Built on the Science of Reading
          </h2>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Phonics First</h3>
              <p className="text-gray-700 mb-4">
                Vowel teams (diphthongs) unlock 40%+ of reading. We focus on what matters most.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Spaced Repetition</h3>
              <p className="text-gray-700 mb-4">
                Proven learning science. We show patterns right when students are about to forget.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Feedback</h3>
              <p className="text-gray-700 mb-4">
                Kids know immediately if they're right. No waiting for teacher feedback.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Works Offline</h3>
              <p className="text-gray-700 mb-4">
                Works on any device — no internet required. Download once, learn anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Signup Section */}
      <section id="beta" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">Stay Updated</h2>
          <p className="text-lg text-blue-100 text-center mb-8 max-w-2xl mx-auto">
            Get notified when new features launch. Subscribe to our newsletter.
          </p>

          {submitted ? (
            <div className="max-w-md mx-auto bg-white/10 border border-white/20 rounded-lg p-6 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">Subscribed!</h3>
              <p className="text-blue-100">
                Thanks! We'll keep you updated on new features and achievements.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
              {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
            </form>
          )}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to dive in?</h2>
          <button
            onClick={onEnter}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition mb-8"
          >
            Play Free Now →
          </button>
          <p className="text-gray-400 text-sm mb-4">© 2026 Diphthong Dash. Built by educators for real progress.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white">Contact</a>
          </div>
        </div>
      </section>
    </div>
  );
}
