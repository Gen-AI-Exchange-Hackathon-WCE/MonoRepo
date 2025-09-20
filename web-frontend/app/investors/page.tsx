'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, MapPin, DollarSign, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { getInvestors, showInterest, Investor, GetInvestorsFilters } from '@/lib/api/investor';
import Link from 'next/link';

export default function InvestorsPage() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [minInvestment, setMinInvestment] = useState('');
  const [maxInvestment, setMaxInvestment] = useState('');
  
  // Investment request state
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Load investors
  useEffect(() => {
    const loadInvestors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filters: GetInvestorsFilters = {};
        if (selectedLocation) filters.location = selectedLocation;
        if (minInvestment) filters.minInvestment = parseInt(minInvestment);
        if (maxInvestment) filters.maxInvestment = parseInt(maxInvestment);

        const response = await getInvestors(filters);
        
        if (response.success && response.data) {
          setInvestors(response.data);
        } else {
          setError(response.message || 'Failed to load investors');
        }
      } catch (err: any) {
        console.error('Failed to load investors:', err);
        setError(err.message || 'Failed to load investors');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvestors();
  }, [selectedLocation, minInvestment, maxInvestment]);

  // Filter investors based on search
  const filteredInvestors = investors.filter(investor => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (investor.organization && investor.organization.toLowerCase().includes(search)) ||
      (investor.location && investor.location.toLowerCase().includes(search)) ||
      (investor.description && investor.description.toLowerCase().includes(search)) ||
      (investor.investmentFocus?.name && investor.investmentFocus.name.toLowerCase().includes(search))
    );
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = Array.from(
    new Set(investors.map(investor => investor.location).filter(Boolean))
  );

  // Handle investment request
  const handleSendRequest = async () => {
    if (!selectedInvestor || !user || !requestMessage.trim()) return;
    
    setIsSubmittingRequest(true);
    try {
      const response = await showInterest({
        investorId: selectedInvestor.id,
        message: requestMessage.trim()
      });
      
      if (response.success) {
        setRequestSuccess(true);
        setRequestMessage('');
        setTimeout(() => {
          setSelectedInvestor(null);
          setRequestSuccess(false);
        }, 2000);
      } else {
        setError(response.message || 'Failed to send investment request');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send investment request');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const formatInvestmentRange = (investor: Investor) => {
    if (investor.minInvestment && investor.maxInvestment) {
      return `₹${investor.minInvestment.toLocaleString()} - ₹${investor.maxInvestment.toLocaleString()}`;
    } else if (investor.minInvestment) {
      return `₹${investor.minInvestment.toLocaleString()}+`;
    } else if (investor.maxInvestment) {
      return `Up to ₹${investor.maxInvestment.toLocaleString()}`;
    }
    return 'Investment range not specified';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100">
                <Link href="/explore">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Find Investors</h1>
                  <p className="text-sm text-gray-600">Connect with investors interested in your craft</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                type="text"
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location || 'unknown'} value={location || ''}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <Input
                type="number"
                placeholder="Min Investment"
                value={minInvestment}
                onChange={(e) => setMinInvestment(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Max Investment"
                value={maxInvestment}
                onChange={(e) => setMaxInvestment(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? "Loading investors..." : `Showing ${filteredInvestors.length} investor${filteredInvestors.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Investors Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestors.map(investor => (
              <Card key={investor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {investor.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{investor.email}</p>
                      {investor.organization && (
                        <p className="text-sm text-gray-600 mt-1">{investor.organization}</p>
                      )}
                      {investor.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          {investor.location}
                        </div>
                      )}
                    </div>
                    {investor.investmentFocus && (
                      <Badge variant="secondary" className="text-xs">
                        {investor.investmentFocus.name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Investment Range */}
                  {(investor.minInvestment || investor.maxInvestment) ? (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">{formatInvestmentRange(investor)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Investment range not specified</span>
                    </div>
                  )}

                  {/* Description */}
                  {investor.description ? (
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {investor.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No description provided yet
                    </p>
                  )}

                  {/* Contact Information */}
                  <div className="space-y-2">
                    {investor.phone && (
                      <div className="text-sm">
                        <span className="text-gray-500">Phone: </span>
                        <span className="text-gray-700">{investor.phone}</span>
                      </div>
                    )}
                    
                    {/* Website */}
                    {investor.website && (
                      <div className="text-sm">
                        <span className="text-gray-500">Website: </span>
                        <a
                          href={investor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {investor.website}
                        </a>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {investor.linkedInUrl && (
                      <div className="text-sm">
                        <span className="text-gray-500">LinkedIn: </span>
                        <a
                          href={investor.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Request Investment Button - Only for Artists */}
                  {user && user.role === "ARTIST" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => setSelectedInvestor(investor)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Request Investment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            Request Investment from {investor.name}
                          </DialogTitle>
                        </DialogHeader>
                        {requestSuccess ? (
                          <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Request Sent!</h3>
                            <p className="text-gray-500">
                              Your investment request has been sent successfully.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message to Investor
                              </label>
                              <Textarea
                                placeholder="Tell the investor about your project, funding needs, and why they should invest in you..."
                                value={requestMessage}
                                onChange={(e) => setRequestMessage(e.target.value)}
                                rows={4}
                                className="w-full"
                              />
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedInvestor(null);
                                  setRequestMessage('');
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleSendRequest}
                                disabled={!requestMessage.trim() || isSubmittingRequest}
                              >
                                {isSubmittingRequest ? "Sending..." : "Send Request"}
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investors found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
