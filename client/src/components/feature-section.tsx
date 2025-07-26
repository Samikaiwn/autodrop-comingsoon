export default function FeatureSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl mb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose AutoDrop Platform?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the future of e-commerce with our automated import and fulfillment system
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-rocket text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Automated product imports from AliExpress with real-time inventory sync
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-shield-alt text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Stripe-powered checkout with enterprise-grade security for all transactions
            </p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <i className="fas fa-truck text-white text-2xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Shipping</h3>
            <p className="text-gray-600">
              Worldwide delivery with local warehouses for faster shipping times
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
