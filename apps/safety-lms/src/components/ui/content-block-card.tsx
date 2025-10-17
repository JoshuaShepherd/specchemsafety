import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentBlock } from "@/lib/types/lms-content";

interface ContentBlockCardProps {
  block: ContentBlock;
  onBlockClick?: (block: ContentBlock) => void;
}

export function ContentBlockCard({
  block,
  onBlockClick,
}: ContentBlockCardProps) {
  const getBlockTypeColor = (blockType: string) => {
    switch (blockType) {
      case "hero":
        return "bg-blue-100 text-blue-800";
      case "text":
        return "bg-gray-100 text-gray-800";
      case "card":
        return "bg-green-100 text-green-800";
      case "image":
        return "bg-purple-100 text-purple-800";
      case "table":
        return "bg-yellow-100 text-yellow-800";
      case "list":
        return "bg-indigo-100 text-indigo-800";
      case "grid":
        return "bg-pink-100 text-pink-800";
      case "callout":
        return "bg-orange-100 text-orange-800";
      case "quote":
        return "bg-teal-100 text-teal-800";
      case "divider":
        return "bg-slate-100 text-slate-800";
      case "video":
        return "bg-red-100 text-red-800";
      case "audio":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onBlockClick?.(block)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize">
            {block.blockType}
          </CardTitle>
          <Badge className={getBlockTypeColor(block.blockType)}>
            {block.blockType}
          </Badge>
        </div>
        <CardDescription>Order: {block.orderIndex}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Content: {JSON.stringify(block.content).substring(0, 100)}...</p>
          {block.metadata && (
            <p>
              Metadata: {JSON.stringify(block.metadata).substring(0, 100)}...
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
