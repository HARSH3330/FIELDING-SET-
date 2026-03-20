"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';
import { ImagePlus, X, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const uploadSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(100),
  caption: z.string().max(500).optional(),
});

type UploadFormValues = z.infer<typeof uploadSchema>;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { name: '', caption: '' },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      toast.error('You must be logged in to upload');
      router.push('/sign-in');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleFileChange = (selectedFile: File | undefined) => {
    if (!selectedFile) return;
    
    // Basic validation
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      toast.error('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: UploadFormValues) => {
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', data.name);
      if (data.caption) {
        formData.append('caption', data.caption);
      }

      // Configure explicitly for multipart
      const res = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post declared Fielding Set successfully!');
      router.push(`/post/${res.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload post');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-zinc-800 bg-[#161616] text-white">
        <CardHeader className="text-center pb-4 border-b border-zinc-800">
          <CardTitle className="text-2xl font-black italic tracking-tighter text-[#22c55e]">
            DECLARE FIELDING SET
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Image Upload Area */}
              <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                  ${isDragActive ? 'border-[#22c55e] bg-[#22c55e]/10' : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800'}
                  ${previewUrl ? 'border-none p-0 overflow-hidden' : 'cursor-pointer'}
                `}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !previewUrl && fileInputRef.current?.click()}
              >
                {!previewUrl ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <ImagePlus className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-300">Click or drag image to upload</p>
                      <p className="text-xs text-zinc-500 mt-1">JPEG, PNG, WEBP up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img src={previewUrl} alt="Preview" className="w-full max-h-[500px] object-contain bg-black" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(); }}
                      className="absolute top-4 right-4 bg-black/70 hover:bg-red-500/90 text-white rounded-full p-2 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    {/* Fake watermark overlay to tease the final state */}
                    <div className="absolute bottom-4 left-0 right-0 p-4 text-center pointer-events-none opacity-50">
                      <div className="inline-block -rotate-2 border-2 border-[#22c55e] px-2 py-0.5">
                        <span className="text-xl font-black italic tracking-widest text-[#22c55e]">
                          FIELDING SET
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
              </div>

              {/* Form Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Name of Person</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Local Politician, Friendly Neighbor" className="border-zinc-700 bg-zinc-900 text-white text-lg font-bold" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caption"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Caption (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Context or witty remark..." 
                        className="border-zinc-700 bg-zinc-900 text-white resize-none h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 bg-[#22c55e] text-black hover:bg-[#22c55e]/90 text-lg font-black italic tracking-wider transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]" 
                disabled={isUploading || !file}
              >
                {isUploading ? (
                  <UploadCloud className="mr-2 h-6 w-6 animate-pulse" />
                ) : (
                  'DECLARE FIELDING SET'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
