# Blog management recipes

# List blog posts in blog/content/
list-blog-posts:
    @ls -1 blog/content/*.md | xargs -I {} basename {} .md

# Update blog-posts.json from blog/content/
update-blog-posts:
    #!/bin/bash
    set -e
    POSTS_DIR="blog/content"
    OUTPUT_FILE="assets/blog-posts.json"
    
    echo "[" > "$OUTPUT_FILE"
    first=true
    for mdfile in "$POSTS_DIR"/*.md; do
        if [ -f "$mdfile" ]; then
            filename=$(basename "$mdfile" .md)
            
            # Extract title from frontmatter
            title=$(sed -n 's/^title = "\(.*\)"/\1/p' "$mdfile" | head -1)
            description=$(sed -n 's/^description = "\(.*\)"/\1/p' "$mdfile" | head -1)
            date=$(sed -n 's/^date = \([0-9-]*\).*/\1/p' "$mdfile" | head -1)
            
            if [ -n "$title" ]; then
                if [ "$first" = true ]; then
                    first=false
                else
                    echo "," >> "$OUTPUT_FILE"
                fi
                printf '  {\n    "id": "%s",\n    "title": "%s",\n    "description": "%s",\n    "date": "%s"\n  }' "$filename" "$title" "$description" "$date" >> "$OUTPUT_FILE"
            fi
        fi
    done
    echo -e "\n]" >> "$OUTPUT_FILE"
    echo "Updated $OUTPUT_FILE"
