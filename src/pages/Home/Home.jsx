import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #8B4A6B 0%, #6d3a55 100%)',
        minHeight:  '90vh',
        display:    'flex',
        alignItems: 'center'
      }}>
        <div className="container text-center text-white">
          <h1 style={{ fontSize: '3.5rem', fontWeight: 700 }}>
            Your Dream Wedding Starts Here
          </h1>
          <p style={{ fontSize: '1.3rem', opacity: 0.9 }}
            className="mt-3 mb-5">
            Discover our stunning wedding halls and create
            unforgettable memories
          </p>
          <Link to="/halls"
            className="btn btn-light btn-lg px-5 me-3"
            style={{ color: '#8B4A6B', fontWeight: 600 }}>
            View Our Halls
          </Link>
          <Link to="/register"
            className="btn btn-outline-light btn-lg px-5">
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5"
          style={{ color: '#8B4A6B' }}>
          Why Choose Us
        </h2>
        <div className="row g-4">
          {[
            {
              icon:  '💒',
              title: 'Beautiful Venues',
              desc:  'Choose from our stunning collection of wedding halls for every style and budget.'
            },
            {
              icon:  '📅',
              title: 'Easy Booking',
              desc:  'Check availability in real-time and book your perfect date with just a few clicks.'
            },
            {
              icon:  '🍽️',
              title: 'Premium Catering',
              desc:  'Select from our curated menu packages designed by expert chefs.'
            },
            {
              icon:  '✨',
              title: 'Custom Decorations',
              desc:  'Personalize your venue with our beautiful decoration and lighting options.'
            }
          ].map((feature, i) => (
            <div key={i} className="col-md-3">
              <div className="card text-center p-4 h-100">
                <div style={{ fontSize: '3rem' }}>
                  {feature.icon}
                </div>
                <h5 className="mt-3 mb-2">{feature.title}</h5>
                <p className="text-muted mb-0">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ background: '#f8f0f4' }} className="py-5">
        <div className="container text-center">
          <h3 style={{ color: '#8B4A6B' }}>
            Ready to Plan Your Perfect Day?
          </h3>
          <p className="text-muted mt-2 mb-4">
            Browse our halls and start planning today
          </p>
          <Link to="/halls"
            className="btn btn-primary btn-lg text-white px-5">
            Explore Halls
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">
            © 2024 Wedding Hall System. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}