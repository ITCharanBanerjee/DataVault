import { SnippetWithAuthor } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Copy, User, Calendar } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";

interface SnippetCardProps {
  snippet: SnippetWithAuthor;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const copyToClipboard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(snippet.code);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
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

  // Get first few lines of code for preview
  const codePreview = snippet.code.split('\n').slice(0, 3).join('\n');
  const hasMoreLines = snippet.code.split('\n').length > 3;

  return (
    <Link href={`/snippet/${snippet.id}`}>
      <Card className="glass-effect border-glass-border hover-lift cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300">{snippet.author.username}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Heart className="w-4 h-4 text-red-500" />
              <span>{snippet.likes}</span>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2 line-clamp-1">{snippet.title}</h3>
          {snippet.description && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{snippet.description}</p>
          )}
          
          <div className="code-preview rounded-lg p-4 text-xs font-mono mb-4 relative">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {codePreview}
              {hasMoreLines && <span className="text-gray-500">...</span>}
            </pre>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className={getLanguageColor(snippet.language)}>
                {snippet.language}
              </Badge>
              <div className="flex items-center space-x-1 text-gray-400 text-xs">
                <Calendar className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={copyToClipboard}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
