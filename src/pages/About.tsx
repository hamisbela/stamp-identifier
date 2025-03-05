import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Free Stamp Identifier, your go-to resource for AI-powered stamp identification and valuation.
            We're passionate about helping people discover and learn about different postage stamps through
            technology, while providing valuable information about their origin, history, and estimated value.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make stamp identification accessible to everyone by providing a free, easy-to-use
            recognition tool. We aim to help collectors, philatelists, and anyone who has discovered stamps
            to identify their finds, learn about their historical significance, and understand their potential value.
            Our tool is designed for informational purposes, helping stamp enthusiasts and curious minds identify
            postal treasures from around the world.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI stamp recognition technology</li>
            <li>Detailed historical and country identification</li>
            <li>Condition assessment and grading guidance</li>
            <li>Value estimation and rarity information</li>
            <li>Philatelic context and collecting recommendations</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this stamp identification tool free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            stamp enthusiasts who want to learn about and identify their philatelic treasures.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=stamp-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}