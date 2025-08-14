import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SnippetWithAuthor } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import SnippetCard from "@/components/snippet-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus, Code, Heart, Eye, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userSnippets, isLoading } = useQuery<SnippetWithAuthor[]>({
    queryKey: ["/api/user/snippets"],
  });

  const deleteSnippetMutation = useMutation({
    mutationFn: async (snippetId: string) => {
      await apiRequest("DELETE", `/api/snippets/${snippetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/snippets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/snippets"] });
      toast({
        title: "Snippet deleted",
        description: "Your snippet has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete snippet",
        variant: "destructive",
      });
    },
  });

  const handleDeleteSnippet = (snippetId: string) => {
    deleteSnippetMutation.mutate(snippetId);
  };

  const totalLikes = userSnippets?.reduce((sum, snippet) => sum + snippet.likes, 0) || 0;
  const publicSnippets = userSnippets?.filter(snippet => snippet.isPublic).length || 0;
  const privateSnippets = userSnippets?.filter(snippet => !snippet.isPublic).length || 0;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Welcome back, <span className="gradient-text">{user?.username}</span>
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your code snippets and track your contributions.
              </p>
            </div>
            <Link href="/create">
              <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Snippet
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="glass-effect border-glass-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Code className="w-5 h-5 mr-2 text-primary" />
                  Total Snippets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : userSnippets?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-glass-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Total Likes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : totalLikes}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-glass-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-green-500" />
                  Public
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : publicSnippets}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-glass-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-5 h-5 mr-2 bg-gray-500 rounded"></div>
                  Private
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold gradient-text">
                  {isLoading ? <Skeleton className="h-8 w-16" /> : privateSnippets}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Snippets Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Your Snippets</h2>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
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
                ))}
              </div>
            ) : userSnippets?.length ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSnippets.map((snippet) => (
                  <div key={snippet.id} className="relative group">
                    <SnippetCard snippet={snippet} />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center space-x-2">
                        {!snippet.isPublic && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 opacity-80 hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-effect border-glass-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Snippet</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{snippet.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSnippet(snippet.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="glass-effect border-glass-border">
                <CardContent className="text-center py-12">
                  <Code className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">No snippets yet</h3>
                  <p className="text-gray-400 mb-6">
                    Create your first code snippet and start sharing with the community.
                  </p>
                  <Link href="/create">
                    <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Snippet
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
