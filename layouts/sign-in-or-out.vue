<script lang="ts" setup></script>

<template>
  <div class="md:hidden">

  </div>

  <div
      class="container h-screen relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900"/>
      <div class="relative z-20 flex items-center text-lg font-medium">
        <Icon name="mdi:skull-crossbones"/>
        <div class="ml-2">
          Enspire
        </div>
      </div>
      e
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            "Make life great again at SWFLA!"
          </p>
          <footer class="text-sm">
            Powered by Computerization
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6">
        <slot/>
        <p class="px-8 text-center text-sm text-muted-foreground">
          点击继续，即表示您同意将数据递交给我们处理，<br/>信息化社将竭力保证每一位用户的隐私安全。
        </p>
      </div>
    </div>
  </div>
</template>
