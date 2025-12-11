<script setup lang="ts">
import { marked } from 'marked'

interface ConstitutionNode {
  type: 'title' | 'section' | 'part' | 'article'
  number: number
  name: string
  file?: string
  children?: ConstitutionNode[]
}

interface ArticleContent {
  frontmatter: {
    number?: number
    title?: string
    lastAmended?: string
  }
  content: string
}

const props = defineProps<{
  node: ConstitutionNode
  level?: number
}>()

const level = props.level || 1

// Fetch article content if this is an article node
const articleContent = ref<ArticleContent | null>(null)
const isLoading = ref(false)
const lastCommit = ref<any>(null)

if (props.node.type === 'article' && props.node.file) {
  isLoading.value = true
  try {
    const response = await $fetch(`/api/github/article?file=${props.node.file}`)
    
    // Parse frontmatter and content
    const content = response.content as string
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    
    if (frontmatterMatch) {
      const frontmatterText = frontmatterMatch[1]
      const markdownContent = frontmatterMatch[2]
      
      // Simple frontmatter parser
      const frontmatter: any = {}
      frontmatterText.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '')
          frontmatter[key.trim()] = value
        }
      })
      
      articleContent.value = {
        frontmatter,
        content: markdownContent.trim()
      }
    } else {
      articleContent.value = {
        frontmatter: {},
        content: content
      }
    }

    // Fetch the last commit for this file
    try {
      const commit = await $fetch(`/api/github/file-commit?file=${props.node.file}`)
      if (commit) {
        lastCommit.value = commit
      }
    } catch (error) {
      console.error('Failed to fetch commit for article:', error)
    }
  } catch (error) {
    console.error('Failed to load article:', error)
  } finally {
    isLoading.value = false
  }
}

// Render markdown to HTML
const renderedContent = computed(() => {
  if (!articleContent.value) return ''
  return marked(articleContent.value.content)
})

// Generate heading text based on type
const headingText = computed(() => {
  switch (props.node.type) {
    case 'title':
      return `Τίτλος ${props.node.number} — ${props.node.name}`
    case 'section':
      return `Τμήμα ${props.node.number} — ${props.node.name}`
    case 'part':
      return `Μέρος ${props.node.number} — ${props.node.name}`
    case 'article':
      return `Άρθρο ${props.node.number} — ${props.node.name}`
    default:
      return props.node.name
  }
})

// Get heading tag based on type
const headingTag = computed(() => {
  switch (props.node.type) {
    case 'title': return 'h1'
    case 'section': return 'h2'
    case 'part': return 'h3'
    case 'article': return 'h4'
    default: return 'div'
  }
})
</script>

<template>
  <div class="constitution-node print:break-inside-avoid">
    <!-- Render heading -->
    <component 
      :is="headingTag" 
      class="font-serif"
      :class="{
        'text-3xl font-bold mb-6 pb-3 border-b-2 border-border': node.type === 'title',
        'text-2xl font-semibold mb-4 mt-8 pb-2 border-b border-border': node.type === 'section',
        'text-xl font-semibold mb-3 mt-6': node.type === 'part',
        'text-lg font-bold mb-2 mt-4': node.type === 'article',
      }"
    >
      {{ headingText }}
    </component>

    <!-- Render article content if this is an article -->
    <div v-if="node.type === 'article'" class="article-content mb-6">
      <div v-if="isLoading" class="text-muted-foreground font-serif">
        Φόρτωση...
      </div>
      <div v-else-if="articleContent">
        <!-- Article content -->
        <div 
          class="prose prose-slate max-w-none font-serif mb-4"
          v-html="renderedContent"
        />
        
        <!-- Separator line -->
        <div class="border-t border-border/50 pt-2 mt-4 amendment-info">
          <!-- Amendment info - subtle and small -->
          <div v-if="lastCommit" class="text-xs text-muted-foreground/70 font-serif flex items-center gap-1.5">
            <span>Τροποποιήθηκε στις</span>
            <NuxtLink 
              :to="`/commits/${lastCommit.sha}`"
              class="hover:text-foreground/80 underline decoration-dotted"
            >
              {{ new Date(lastCommit.commit.author.date).toLocaleDateString('el-GR') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Recursively render children -->
    <div v-if="node.children && node.children.length > 0">
      <ConstitutionNode
        v-for="(child, index) in node.children"
        :key="`${child.type}-${child.number}-${index}`"
        :node="child"
        :level="level + 1"
      />
    </div>
  </div>
</template>

<style scoped>
/* Article content styling */
.article-content :deep(p) {
  @apply mb-3 leading-relaxed;
}

.article-content :deep(p:last-child) {
  @apply mb-0;
}
</style>
