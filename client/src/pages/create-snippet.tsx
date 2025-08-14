import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSnippetSchema, InsertSnippet } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Redirect } from "wouter";
import Navigation from "@/components/navigation";
import CodeEditor from "@/components/code-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Eye } from "lucide-react";

export default function CreateSnippet() {
  const [code, setCode] = useState('// Start writing your code here...\n');
  const [language, setLanguage] = useState('javascript');
  const [snippetId, setSnippetId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSnippet>({
    resolver: zodResolver(insertSnippetSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      language: "javascript",
      isPublic: true,
    },
  });

  const createSnippetMutation = useMutation({
    mutationFn: async (data: InsertSnippet) => {
      const res = await apiRequest("POST", "/api/snippets", data);
      return await res.json();
    },
    onSuccess: (snippet) => {
      queryClient.invalidateQueries({ queryKey: ["/api/snippets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/snippets"] });
      setSnippetId(snippet.id);
      toast({
        title: "Snippet created!",
        description: "Your code snippet has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create snippet",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertSnippet) => {
    createSnippetMutation.mutate({
      ...data,
      code,
      language,
    });
  };

  // Redirect to snippet detail page after creation
  if (snippetId) {
    return <Redirect to={`/snippet/${snippetId}`} />;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Create New <span className="gradient-text">Snippet</span>
            </h1>
            <p className="text-gray-300 text-lg">
              Share your code with the community and help other developers learn.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Code Editor */}
            <div className="lg:col-span-2">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                onLanguageChange={setLanguage}
                title={form.watch('title') || 'untitled'}
              />
            </div>

            {/* Snippet Details Form */}
            <div className="space-y-6">
              <Card className="glass-effect border-glass-border">
                <CardHeader>
                  <CardTitle>Snippet Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Give your snippet a descriptive title"
                                className="bg-input border-border"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what your code does, how it works, or when to use it"
                                className="bg-input border-border min-h-[100px]"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Separator />

                      <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-y-0">
                            <div>
                              <FormLabel>Public Snippet</FormLabel>
                              <p className="text-sm text-gray-400">
                                Make this snippet visible to everyone
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                          disabled={createSnippetMutation.isPending || !code.trim() || !form.watch('title')}
                        >
                          {createSnippetMutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          <Save className="mr-2 h-4 w-4" />
                          Create Snippet
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Preview Card */}
              <Card className="glass-effect border-glass-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {form.watch('title') || 'Untitled Snippet'}
                      </h3>
                      {form.watch('description') && (
                        <p className="text-gray-400 text-sm mt-1">
                          {form.watch('description')}
                        </p>
                      )}
                    </div>
                    
                    <div className="code-preview rounded-lg p-4 text-xs font-mono">
                      <pre className="text-gray-300 whitespace-pre-wrap">
                        {code.split('\n').slice(0, 5).join('\n')}
                        {code.split('\n').length > 5 && <span className="text-gray-500">...</span>}
                      </pre>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        language === 'javascript' ? 'bg-yellow-500/20 text-yellow-400' :
                        language === 'python' ? 'bg-green-500/20 text-green-400' :
                        language === 'typescript' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {language}
                      </span>
                      <span className="text-gray-400">
                        {form.watch('isPublic') ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
