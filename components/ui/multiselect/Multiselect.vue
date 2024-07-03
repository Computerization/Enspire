<!-- Translated into Vue from this beautiful piece of React <del>shit</del>code : https://github.com/sersavan/shadcn-multi-select-component -->

<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { ref, watch } from "vue";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
} from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { ScrollArea } from '@/components/ui/scroll-area'

const multiSelectVariants = cva(
    "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
    {
      variants: {
        variant: {
          default:
              "border-foreground/10 text-foreground bg-card hover:bg-card/80",
          secondary:
              "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
              "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          inverted: "inverted",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
);

interface Option {
  label: string;
  value: string;
  // icon?: (props: { className?: string }) => JSX.Element;
}

interface MultiSelectVariantProps extends VariantProps<typeof multiSelectVariants> {}

interface MultiSelectProps {
  variant?: MultiSelectVariantProps["variant"];
  options: Option[];
  onValueChange: (value: string[]) => void;
  defaultValue: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  asChild?: boolean;
  class?: string;
}

const props = defineProps<MultiSelectProps>();

const selectedValues = ref([...props.defaultValue]);
const isPopoverOpen = ref(false);
const isAnimating = ref(false);
const buttonRef = ref(undefined);

watch(() => props.defaultValue, (newVal) => {
  if (JSON.stringify(selectedValues.value) !== JSON.stringify(newVal)) {
    selectedValues.value = [...newVal];
  }
});

const toggleOption = (value: string) => {
  const newSelectedValues = selectedValues.value.includes(value)
      ? selectedValues.value.filter((v) => v !== value)
      : [...selectedValues.value, value];
  selectedValues.value = newSelectedValues;
  props.onValueChange(newSelectedValues);
};

const handleClear = () => {
  selectedValues.value = [];
  props.onValueChange([]);
};

const clearExtraOptions = () => {
  const newSelectedValues = selectedValues.value.slice(0, props.maxCount);
  selectedValues.value = newSelectedValues;
  props.onValueChange(newSelectedValues);
};

const toggleAll = () => {
  if (selectedValues.value.length === props.options.length) {
    handleClear();
  } else {
    const allValues = props.options.map((option) => option.value);
    selectedValues.value = allValues;
    props.onValueChange(allValues);
  }
};

const handleInputKeyDown = (
    event: KeyboardEvent,
) => {
  if (event.key === "Enter") {
    isPopoverOpen.value = true
  } else if (event.key === "Backspace" && !event.currentTarget) {
    const newSelectedValues = [...selectedValues.value];
    newSelectedValues.pop();
    selectedValues.value = newSelectedValues
    props.onValueChange(newSelectedValues);
  }
};

</script>

<template>
  <div class="relative" @click="isPopoverOpen = !isPopoverOpen">
    <Popover :open="isPopoverOpen" @update:open="isPopoverOpen = !isPopoverOpen">
      <PopoverTrigger asChild>
        <Button
            :ref="buttonRef"
            @click="isPopoverOpen = !isPopoverOpen"
            :class="cn(
        'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit',
              props.class
            )"
        >
          <div v-if="selectedValues.length > 0" class="flex justify-between items-center w-full">
            <div class="flex flex-wrap items-center">
              <Badge
                v-for="value in selectedValues.slice(0, maxCount)"
                :option="options.find((o) => o.value === value)"
                :key="value"
                :class="cn(
                  isAnimating ? 'animate-bounce' : '',
                   multiSelectVariants({ variant, class: props.class })
                )"
                :style="{ animationDuration: `${animation}s` }"
              >
                {{ options.find((o) => o.value === value)?.label }}
                <XCircle
                    class="ml-2 h-4 w-4 cursor-pointer"
                    @click="(event) => {
                      event.stopPropagation();
                      toggleOption(value);
                    }"
                />
              </Badge>
              <Badge
                v-if="maxCount && selectedValues.length > maxCount"
                :class="cn(
                  'bg-transparent text-foreground border-foreground/1 hover:bg-transparent',
                  isAnimating ? 'animate-bounce' : '',
                  multiSelectVariants({ variant, class: props.class })
                 )"
                :style="{ animationDuration: `${animation}s` }"
              >
                {{`+ ${selectedValues.length - maxCount} more`}}
                <XCircle
                  class="ml-2 h-4 w-4 cursor-pointer"
                  @click="(event) => {
                    event.stopPropagation();
                    clearExtraOptions();
                  }"
                />
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <XIcon
                class="h-4 mx-2 cursor-pointer text-muted-foreground"
                @click="(event) => {
                  event.stopPropagation();
                  handleClear();
                }"
              />
              <Separator
                  orientation="vertical"
                  class="flex min-h-6 h-full"
              />
              <ChevronDown class="h-4 mx-2 cursor-pointer text-muted-foreground" />
            </div>
          </div>
          <div class="flex items-center justify-between w-full mx-auto" v-else>
                  <span class="text-sm text-muted-foreground mx-3">
                    {{ placeholder }}
                  </span>
            <ChevronDown class="h-4 cursor-pointer text-muted-foreground mx-2" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
          class="flex w-full p-0"
          align="start"
          @keydown.esc="isPopoverOpen = false"
      >
        <Command>
          <CommandInput
              placeholder="Search..."
              @keydown="handleInputKeyDown($event)"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <ScrollArea class="max-h-56">
              <CommandGroup>
                  <CommandItem
                      value="all"
                      key="all"
                      @select="toggleAll"
                      class="cursor-pointer"
                  >
                    <div
                      :class="cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValues.length ===
                          options.length
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                      )"
                    >
                      <CheckIcon class="h-4 w-4" />
                    </div>
                    <span>(Select All)</span>
                  </CommandItem>
                  <CommandItem
                      :value="option.value"
                      v-for="option in options"
                      :key=option.value
                      @select="() => toggleOption(option.value)"
                      class="cursor-pointer"
                  >
                    <div
                      :class="cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selectedValues.includes(option.value)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )"
                    >
                      <CheckIcon class="h-4 w-4" />
                    </div>
                    <!-- {option.icon && ( <option.icon class="mr-2 h-4 w-4 text-muted-foreground" />) } -->
                    <span>{{ option.label }}</span>
                </CommandItem>
                </CommandGroup>
            </ScrollArea>
            <CommandSeparator />
            <CommandGroup>
                <div class="flex items-center justify-between">
                  <CommandItem
                      v-if="selectedValues.length > 0"
                      value="clear"
                      @click="handleClear"
                      class="flex-1 justify-center cursor-pointer"
                  >
                    Clear
                  </CommandItem>
                  <Separator
                      v-if="selectedValues.length > 0"
                      orientation="vertical"
                      class="min-h-6 h-full"
                  />
                  <CommandSeparator />
                  <CommandItem
                    value="close"
                    @click="isPopoverOpen = false"
                    class="flex-1 justify-center cursor-pointer ml-2"
                  >
                    Close
                  </CommandItem>
                </div>
              </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  </div>
</template>
