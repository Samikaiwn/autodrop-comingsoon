import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function BotManagement() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState("");
  const [adPlatform, setAdPlatform] = useState("facebook");
  const [emailType, setEmailType] = useState("newsletter");
  const [decorationTheme, setDecorationTheme] = useState("modern");

  // Get bot phone number
  const { data: phoneData } = useQuery({
    queryKey: ["/api/bots/phone-number"],
  });

  // Get products for ad generation
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  // Test email bot
  const emailBotMutation = useMutation({
    mutationFn: async (data: { from: string; subject: string; body: string }) => {
      const response = await fetch("/api/bots/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Email bot failed");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Bot Response",
        description: "Email processed and response sent successfully!"
      });
    }
  });

  // Generate product ad
  const adGenerationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bots/ads/product/${selectedProduct}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: adPlatform })
      });
      if (!response.ok) throw new Error("Ad generation failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Ad Generated!",
        description: `Created ${adPlatform} ad: "${data.headline}"`
      });
    }
  });

  // Generate page decorations
  const decorationMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bots/decorations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: decorationTheme })
      });
      if (!response.ok) throw new Error("Decoration generation failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Page Decorations Generated!",
        description: `Theme: ${decorationTheme} - "${data.heroSection?.headline}"`
      });
    }
  });

  // Generate email campaign
  const emailCampaignMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/bots/email-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: emailType })
      });
      if (!response.ok) throw new Error("Email campaign generation failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Email Campaign Created!",
        description: `${emailType} campaign: "${data.subject}"`
      });
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🤖 AI Bot Management Center
        </h1>
        <p className="text-lg text-gray-600">
          Manage your 24/7 AI-powered customer service and marketing bots
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="email">Email Bot</TabsTrigger>
          <TabsTrigger value="sms">SMS/Phone Bot</TabsTrigger>
          <TabsTrigger value="ads">Ad Creation</TabsTrigger>
          <TabsTrigger value="decorations">Page Design</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-blue-500"></i>
                  <span>Email Bot</span>
                </CardTitle>
                <CardDescription>
                  AI-powered email responses in multiple languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="fas fa-circle text-green-500 mr-1"></i>
                    Active 24/7
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Handles inquiries, support requests, and customer communications automatically.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <i className="fas fa-sms text-orange-500"></i>
                  <span>SMS/Phone Bot</span>
                </CardTitle>
                <CardDescription>
                  Multi-language SMS and voice support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="fas fa-circle text-green-500 mr-1"></i>
                    Active 24/7
                  </Badge>
                  {phoneData?.phoneNumber && (
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                      📞 {phoneData.phoneNumber}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    Responds to SMS and calls in 15+ languages worldwide.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <i className="fas fa-ad text-purple-500"></i>
                  <span>Marketing Bot</span>
                </CardTitle>
                <CardDescription>
                  Automated ad creation and page optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">
                    <i className="fas fa-circle text-green-500 mr-1"></i>
                    Ready
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Creates ads, decorates pages, and generates marketing content.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Email Bot Response</CardTitle>
              <CardDescription>
                Send a test email to see how the AI bot responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email-from">Customer Email</Label>
                  <Input
                    id="email-from"
                    placeholder="customer@example.com"
                    defaultValue="test@customer.com"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    placeholder="Order inquiry"
                    defaultValue="Question about my order"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email-body">Message</Label>
                <Textarea
                  id="email-body"
                  placeholder="Customer message..."
                  defaultValue="Hi, I placed an order yesterday but haven't received tracking information yet. Can you help?"
                  rows={4}
                />
              </div>
              <Button
                onClick={() => {
                  const from = (document.getElementById("email-from") as HTMLInputElement)?.value;
                  const subject = (document.getElementById("email-subject") as HTMLInputElement)?.value;
                  const body = (document.getElementById("email-body") as HTMLTextAreaElement)?.value;
                  emailBotMutation.mutate({ from, subject, body });
                }}
                disabled={emailBotMutation.isPending}
                className="w-full"
              >
                {emailBotMutation.isPending ? "Processing..." : "Test Email Bot"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS/Phone Bot Information</CardTitle>
              <CardDescription>
                Your dedicated AI phone number for customer support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phoneData?.phoneNumber ? (
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    📞 {phoneData.phoneNumber}
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your customers can text or call this number 24/7
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>SMS Support:</strong>
                      <ul className="text-left mt-2 space-y-1">
                        <li>• Order tracking</li>
                        <li>• Product inquiries</li>
                        <li>• Shipping questions</li>
                        <li>• General support</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Languages:</strong>
                      <ul className="text-left mt-2 space-y-1">
                        <li>• English, Spanish, French</li>
                        <li>• German, Italian, Portuguese</li>
                        <li>• Chinese, Japanese, Arabic</li>
                        <li>• And many more...</li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Twilio phone number will appear here once configured
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Product Ads</CardTitle>
              <CardDescription>
                Create compelling ads for your products across different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-select">Select Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: any) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="platform-select">Platform</Label>
                  <Select value={adPlatform} onValueChange={setAdPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="google">Google Ads</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="email">Email Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={() => adGenerationMutation.mutate()}
                disabled={adGenerationMutation.isPending || !selectedProduct}
                className="w-full"
              >
                {adGenerationMutation.isPending ? "Generating Ad..." : "Generate Product Ad"}
              </Button>

              {adGenerationMutation.isSuccess && adGenerationMutation.data && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Generated Ad:</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Headline:</strong> {adGenerationMutation.data.headline}</p>
                    <p><strong>Description:</strong> {adGenerationMutation.data.description}</p>
                    <p><strong>Call to Action:</strong> {adGenerationMutation.data.callToAction}</p>
                    <p><strong>Target Audience:</strong> {adGenerationMutation.data.targetAudience}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decorations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Page Decorations</CardTitle>
                <CardDescription>
                  Create compelling page elements and promotional content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme-select">Theme</Label>
                  <Select value={decorationTheme} onValueChange={setDecorationTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                      <SelectItem value="urgent">Urgent/Sale</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="tech-focused">Tech-Focused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => decorationMutation.mutate()}
                  disabled={decorationMutation.isPending}
                  className="w-full"
                >
                  {decorationMutation.isPending ? "Generating..." : "Generate Page Decorations"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generate Email Campaign</CardTitle>
                <CardDescription>
                  Create professional email marketing campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email-type-select">Campaign Type</Label>
                  <Select value={emailType} onValueChange={setEmailType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                      <SelectItem value="promotion">Promotional</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => emailCampaignMutation.mutate()}
                  disabled={emailCampaignMutation.isPending}
                  className="w-full"
                >
                  {emailCampaignMutation.isPending ? "Creating..." : "Generate Email Campaign"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {(decorationMutation.isSuccess || emailCampaignMutation.isSuccess) && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {decorationMutation.isSuccess && decorationMutation.data && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Page Decorations:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Banner:</strong> {decorationMutation.data.bannerText}</p>
                      <p><strong>Hero Headline:</strong> {decorationMutation.data.heroSection?.headline}</p>
                      <p><strong>Subtitle:</strong> {decorationMutation.data.heroSection?.subtitle}</p>
                      <p><strong>CTA:</strong> {decorationMutation.data.heroSection?.ctaText}</p>
                    </div>
                  </div>
                )}

                {emailCampaignMutation.isSuccess && emailCampaignMutation.data && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Email Campaign:</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Subject:</strong> {emailCampaignMutation.data.subject}</p>
                      <p><strong>Preheader:</strong> {emailCampaignMutation.data.preheader}</p>
                      <div>
                        <strong>Content Preview:</strong>
                        <div className="mt-1 p-2 bg-white rounded text-xs">
                          {emailCampaignMutation.data.textContent?.substring(0, 200)}...
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}