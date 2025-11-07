import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from 'lucide-react'

interface DemandModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
}

export function DemandModal({ isOpen, onClose, children, title }: DemandModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-40" />
        <Dialog.Content
          className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-[1000px] 
            bg-white text-black rounded-lg shadow-xl"
        >
          <div className="flex items-center justify-between mb-4 bg-black text-white p-4 rounded-t-lg">
             <Dialog.DialogTitle className="text-lg text-orange-600 font-semibold">
              {title}
            </Dialog.DialogTitle>
            <VisuallyHidden>
             
              <Dialog.DialogDescription>
                Descrição oculta para leitores de tela
              </Dialog.DialogDescription>
            </VisuallyHidden>

            <Dialog.Close asChild>
              <button
                className="p-1 rounded-full text-white hover:bg-gray-800"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
