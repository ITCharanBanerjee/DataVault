import { useQuery } from "@tanstack/react-query";
import { SnippetWithAuthor } from "@shared/schema";
import Navigation from "@/components/navigation";
import SnippetCard from "@/components/snippet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Plus, Play, Bolt, Palette, Users, Smartphone, Shield, Search, ArrowRight, Code } from "lucide-react";

export default function HomePage() {
  const { data: popularSnippets, isLoading: popularLoading } = useQuery<SnippetWithAuthor[]>({
    queryKey: ["/api/snippets/popular"],
    queryFn: async () => {
      const response = await fetch("/api/snippets/popular");
      if (!response.ok) throw new Error("Failed to fetch popular snippets");
      return response.json();
    },
  });

  const { data: recentSnippets, isLoading: recentLoading } = useQuery<SnippetWithAuthor[]>({
    queryKey: ["/api/snippets"],
    queryFn: async () => {
      const response = await fetch("/api/snippets");
      if (!response.ok) throw new Error("Failed to fetch snippets");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Share Code <span className="gradient-text">Instantly</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create, share, and discover beautiful code snippets with real-time syntax highlighting and collaborative features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8 py-4 text-lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Snippet
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="glass-effect border-glass-border hover:bg-glass-white px-8 py-4 text-lg">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Code Editor Preview */}
          <Card className="glass-effect border-glass-border shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 text-sm font-mono">fibonacci.js</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">JavaScript</Badge>
                  <Button size="sm" variant="ghost">
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="code-preview rounded-lg p-6 font-mono text-sm overflow-x-auto min-h-[200px] relative">
                <div className="space-y-1">
                  <div className="syntax-comment">// Fibonacci sequence generator</div>
                  <div><span className="syntax-keyword">function</span> <span className="syntax-function">fibonacci</span><span className="text-gray-300">(</span><span className="syntax-number">n</span><span className="text-gray-300">) {'{'}</span></div>
                  <div className="ml-4"><span className="syntax-keyword">if</span> <span className="text-gray-300">(</span><span className="syntax-number">n</span> <span className="text-gray-300">{'<='} 1) </span><span className="syntax-keyword">return</span> <span className="syntax-number">n</span><span className="text-gray-300">;</span></div>
                  <div className="ml-4"><span className="syntax-keyword">return</span> <span className="syntax-function">fibonacci</span><span className="text-gray-300">(</span><span className="syntax-number">n</span> <span className="text-gray-300">- 1) + </span><span className="syntax-function">fibonacci</span><span className="text-gray-300">(</span><span className="syntax-number">n</span> <span className="text-gray-300">- 2);</span></div>
                  <div><span className="text-gray-300">{'}'}</span></div>
                  <div className="mt-3"><span className="syntax-comment">// Example usage</span></div>
                  <div><span className="text-gray-300">console.</span><span className="syntax-function">log</span><span className="text-gray-300">(</span><span className="syntax-function">fibonacci</span><span className="text-gray-300">(10)); </span><span className="syntax-comment">// Output: 55</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for <span className="gradient-text">Developers</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to share, collaborate, and showcase your code with the community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center mb-6">
                  <Bolt className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Sharing</h3>
                <p className="text-gray-300 leading-relaxed">
                  Share your code snippets instantly with a single click. Generate shareable links and embed codes for your projects.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                  <Palette className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Syntax Highlighting</h3>
                <p className="text-gray-300 leading-relaxed">
                  Beautiful syntax highlighting for 50+ programming languages with customizable themes and Monaco Editor integration.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-6">
                  <Users className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
                <p className="text-gray-300 leading-relaxed">
                  Discover trending snippets, like and bookmark favorites, and follow other developers in the community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                  <Smartphone className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Responsive Design</h3>
                <p className="text-gray-300 leading-relaxed">
                  Perfect experience across all devices. Code on desktop, review on mobile, share everywhere.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
                <p className="text-gray-300 leading-relaxed">
                  Control visibility of your snippets. Keep them private, share with teams, or make them public.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-effect border-glass-border hover-lift">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <Search className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Search</h3>
                <p className="text-gray-300 leading-relaxed">
                  Find exactly what you need with advanced search filters by language, tags, and popularity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Snippets Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Trending <span className="gradient-text">Snippets</span>
              </h2>
              <p className="text-gray-300 text-lg">
                Discover popular code snippets from the community
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="glass-effect border-glass-border hover:bg-glass-white">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="glass-effect border-glass-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-24 w-full mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : popularSnippets?.length ? (
              popularSnippets.slice(0, 6).map((snippet) => (
                <SnippetCard key={snippet.id} snippet={snippet} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No snippets found. Be the first to create one!</p>
                <Link href="/create">
                  <Button className="mt-4">Create First Snippet</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="glass-effect border-glass-border">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start <span className="gradient-text">Sharing</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust CodeShare for their snippet management and collaboration needs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8 py-4 text-lg">
                    Create Free Account
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="glass-effect border-glass-border hover:bg-glass-white px-8 py-4 text-lg">
                  View Documentation
                </Button>
              </div>
              
              <div className="flex items-center justify-center space-x-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>No credit card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Code className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold gradient-text">CodeShare</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The modern platform for sharing and discovering code snippets with developers worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/dashboard"><a className="hover:text-white transition-colors">Features</a></Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
                <li><Link href="/dashboard"><a className="hover:text-white transition-colors">Integrations</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="https://discord.gg/developers" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#changelog" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="mailto:support@datavault.com" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#status" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2024 CodeShare. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="https://discord.gg/developers" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
