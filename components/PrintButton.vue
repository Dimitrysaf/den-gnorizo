<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const printConstitution = (includeAmendments: boolean) => {
  // Set a data attribute on body to control amendment visibility
  document.body.setAttribute('data-print-amendments', includeAmendments.toString())
  
  // Trigger print
  window.print()
  
  // Clean up after print
  setTimeout(() => {
    document.body.removeAttribute('data-print-amendments')
  }, 100)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="font-serif">
        <span class="material-symbols-sharp text-[18px] mr-2">print</span>
        Εκτύπωση
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="printConstitution(false)" class="font-serif cursor-pointer">
        <span class="material-symbols-sharp text-[18px] mr-2">description</span>
        Μόνο κείμενο
      </DropdownMenuItem>
      <DropdownMenuItem @click="printConstitution(true)" class="font-serif cursor-pointer">
        <span class="material-symbols-sharp text-[18px] mr-2">history</span>
        Με ημερομηνίες τροποποιήσεων
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
