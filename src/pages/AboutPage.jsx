import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-xl text-gray-300">
              Crafting premium headwear that blends style, comfort, and quality since 2010.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 text-lg">
              At CapStore, we believe that a great hat is more than just an accessory - it's an expression of personality, a statement of style, and a companion for life's adventures.
            </p>
            <p className="text-gray-600 mb-6">
              Founded with a passion for craftsmanship and attention to detail, we've spent over a decade perfecting our collection. Each piece in our store is carefully selected or designed to meet our high standards of quality, comfort, and style.
            </p>
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">13+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500">500+</div>
                <div className="text-gray-600">Unique Designs</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Our workshop" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every cap is crafted from premium materials and undergoes strict quality checks.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Customer Love</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you find the perfect cap and ensure you love wearing it.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Sustainable Practices</h3>
              <p className="text-gray-600">
                We're committed to sustainable manufacturing and ethical sourcing practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Founders</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The passionate individuals behind CapStore
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Alex Johnson",
              role: "CEO & Founder",
              bio: "Former fashion designer with 15+ years in headwear industry",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "Maria Garcia",
              role: "Head of Design",
              bio: "Specializes in sustainable materials and innovative designs",
              img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            },
            {
              name: "David Chen",
              role: "Operations Director",
              bio: "Ensures quality and efficiency in our manufacturing process",
              img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            }
          ].map((member, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-orange-500 font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Stories */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600">
              Join thousands of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                text: "Best caps I've ever owned! The quality is outstanding and they get compliments everywhere I go.",
                name: "Sarah Miller",
                location: "Mumbai"
              },
              {
                text: "Perfect fit, amazing quality. Their customer service went above and beyond when I needed help.",
                name: "Rohan Patel",
                location: "Delhi"
              },
              {
                text: "The attention to detail is incredible. You can tell these are made by people who really care.",
                name: "Priya Sharma",
                location: "Bangalore"
              },
              {
                text: "Finally found a brand that combines style, comfort, and durability perfectly.",
                name: "Arun Kumar",
                location: "Chennai"
              }
            ].map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{review.text}"</p>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-gray-600 text-sm">{review.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Cap?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Browse our collection of premium caps, hats, and beanies. Each piece tells a story - find yours today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold">CapStore</h3>
              <p className="text-gray-400 mt-2">Premium Headwear Since 2010</p>
            </div>
            <div className="flex gap-6">
              <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-orange-400 transition-colors">Shop</Link>
              <Link to="/about" className="hover:text-orange-400 transition-colors">About</Link>
              <Link to="/contact" className="hover:text-orange-400 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 CapStore. All rights reserved. | Crafted with ❤️ for cap enthusiasts worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
}