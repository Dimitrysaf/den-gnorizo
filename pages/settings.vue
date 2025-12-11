<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';

interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  avatar?: string;
  accessToken?: string;
  loggedInAt?: number;
}

// Fetch session directly from server as workaround
const { data: sessionData, refresh: refreshSession } = await useFetch('/api/auth/session-check')

const loggedIn = computed(() => sessionData.value?.hasSession || false)
const githubUser = computed(() => sessionData.value?.sessionData as GitHubUser | null)

const isLoggingOut = ref(false)

const handleLogin = () => {
  window.location.href = '/auth/github'
}

const handleLogout = async () => {
  isLoggingOut.value = true
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await refreshSession()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<template>
  <ReadingContainer>
    <h1 class="text-3xl font-serif font-bold text-foreground mb-8">Ρυθμίσεις</h1>
    
    <!-- Account Section -->
    <section class="mb-8">
      <h2 class="text-xl font-serif font-semibold text-foreground mb-4 pb-2 border-b border-border">
        Λογαριασμός
      </h2>
      
      <div class="bg-muted/20 rounded-sm border border-border p-6">
        <div v-if="!loggedIn" class="flex flex-col items-start gap-4">
          <p class="text-muted-foreground font-serif">
            Συνδεθείτε με το λογαριασμό σας στο GitHub για να συμμετάσχετε στις συζητήσεις.
          </p>
          <Button 
            @click="handleLogin"
            class="font-serif"
          >
            <span class="material-symbols-sharp mr-2 text-[18px]">login</span>
            Σύνδεση με GitHub
          </Button>
        </div>
        
        <div v-else class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <img 
              v-if="githubUser?.avatar" 
              :src="githubUser.avatar" 
              :alt="githubUser.login"
              class="w-12 h-12 rounded-full border-2 border-border"
            />
            <div>
              <p class="font-serif font-semibold text-foreground">
                {{ githubUser?.name || githubUser?.login }}
              </p>
              <p class="text-sm text-muted-foreground font-serif">
                @{{ githubUser?.login }}
              </p>
            </div>
          </div>
          
          <Button 
            @click="handleLogout"
            variant="outline"
            :disabled="isLoggingOut"
            class="font-serif"
          >
            <span class="material-symbols-sharp mr-2 text-[18px]">logout</span>
            {{ isLoggingOut ? 'Αποσύνδεση...' : 'Αποσύνδεση' }}
          </Button>
        </div>
      </div>
    </section>
  </ReadingContainer>
</template>

<style scoped>
/* Scoped styles removed in favor of Tailwind CSS */
</style>
