import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { SnippetWithAuthor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import CodeEditor from "@/components/code-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { Heart, User, Calendar, ArrowLeft, Share2, Download, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SnippetDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: snippet, isLoading, error } = useQuery<SnippetWithAuthor>({
    queryKey: ["/api/snippets", id],
  });

  const { data: likeStatus } = useQuery<{ liked: boolean }>({
    queryKey: ["/api/snippets", id, "liked"],
    enabled: !!user && !!id,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likeStatus?.liked) {
        await apiRequest("DELETE", `/api/snippets/${id}/like`);
      } else {
        await apiRequest("POST", `/api/snippets/${id}/like`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/snippets", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/snippets", id, "liked"] });
      queryClient.invalidateQueries({ queryKey: ["/api/snippets"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update like status",
        variant: "destructive",
      });
    },
  });

  const shareSnippet = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Snippet link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    if (!snippet) return;
    
    const element = document.createElement('a');
    const file = new Blob([snippet.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${snippet.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${getFileExtension(snippet.language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (lang: string) => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      xml: 'xml',
      yaml: 'yml',
      sql: 'sql',
      shell: 'sh',
      dockerfile: 'dockerfile',
      markdown: 'md',
    };
    return extensions[lang] || 'txt';
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500/20 text-yellow-400",
      typescript: "bg-blue-500/20 text-blue-400",
      python: "bg-green-500/20 text-green-400",
      java: "bg-orange-500/20 text-orange-400",
      cpp: "bg-purple-500/20 text-purple-400",
      css: "bg-pink-500/20 text-pink-400",
      html: "bg-red-500/20 text-red-400",
      go: "bg-cyan-500/20 text-cyan-400",
      rust: "bg-amber-500/20 text-amber-400",
    };
    return colors[language.toLowerCase()] || "bg-gray-500/20 text-gray-400";
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-16 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="glass-effect border-glass-border">
              <CardContent className="py-12">
                <h1 className="text-2xl font-bold mb-4">Snippet Not Found</h1>
                <p className="text-gray-400 mb-6">
                  The snippet you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Explore
              </Button>
            </Link>
            
            {isLoading ? (
              <div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-1/2 mb-4" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            ) : snippet ? (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4">{snippet.title}</h1>
                    {snippet.description && (
                      <p className="text-xl text-gray-300 mb-6">{snippet.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600">
                            {snippet.author.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{snippet.author.username}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}
                            </span>
                            <Badge className={getLanguageColor(snippet.language)}>
                              {snippet.language}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {user && (
                      <Button
                        variant={likeStatus?.liked ? "default" : "outline"}
                        onClick={() => likeMutation.mutate()}
                        disabled={likeMutation.isPending}
                        className={likeStatus?.liked ? "bg-red-500 hover:bg-red-600" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${likeStatus?.liked ? "fill-white" : ""}`} />
                        {snippet.likes}
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={shareSnippet}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    
                    <Button variant="outline" onClick={downloadCode}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    {user && user.id === snippet.authorId && (
                      <Link href={`/create?edit=${snippet.id}`}>
                        <Button variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Code Editor */}
          {snippet && (
            <CodeEditor
              value={snippet.code}
              onChange={() => {}} // Read-only
              language={snippet.language}
              onLanguageChange={() => {}} // Read-only
              title={snippet.title}
              readOnly={true}
            />
          )}

          {isLoading && (
            <Card className="glass-effect border-glass-border">
              <CardContent className="p-6">
                <Skeleton className="h-96 w-full" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
