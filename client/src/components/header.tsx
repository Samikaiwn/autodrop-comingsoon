import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCartToggle: () => void;
  cartItemCount: number;
}

export default function Header({ onSearch, onCartToggle, cartItemCount }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <i className="fas fa-droplet text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-primary">AutoDrop Platform</span>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1 ml-8">
              <a href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
                Home
              </a>
              <a href="/bots" className="px-3 py-2 rounded-lg text-sm font-medium text-primary bg-blue-50 rounded-lg transition-colors flex items-center space-x-1">
                <i className="fas fa-robot"></i>
                <span>AI Bots</span>
              </a>
              <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
                Contact
              </a>
              <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
                Terms
              </a>
              <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
                Privacy
              </a>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              <Button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 px-4 bg-primary text-white rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </Button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary transition-colors"
            >
              <i className="fas fa-user"></i>
              <span>My Account</span>
            </Button>
            
            <Button
              onClick={onCartToggle}
              className="relative flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <i className="fas fa-shopping-cart"></i>
              <span>{cartItemCount}</span>
              <span className="hidden sm:inline">Cart</span>
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </div>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary"
            >
              <i className="fas fa-bars"></i>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 p-4">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-2">
            <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
              Contact
            </a>
            <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
              Terms
            </a>
            <a href="#" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors">
              Privacy
            </a>
            <Button
              variant="ghost"
              className="flex items-center justify-start space-x-2 px-3 py-2 text-gray-700 hover:text-primary transition-colors"
            >
              <i className="fas fa-user"></i>
              <span>My Account</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
