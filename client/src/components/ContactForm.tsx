import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertConsultationRequestSchema, type InsertConsultationRequest } from "@shared/schema";
import { useSubmitContact } from "@/hooks/use-contact";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export function ContactForm() {
  const form = useForm<InsertConsultationRequest>({
    resolver: zodResolver(insertConsultationRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const mutation = useSubmitContact();

  const onSubmit = (data: InsertConsultationRequest) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="t-muted text-xs font-bold uppercase tracking-widest pl-1">Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" className="glow-input h-14 rounded-2xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="t-muted text-xs font-bold uppercase tracking-widest pl-1">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 98765 43210" className="glow-input h-14 rounded-2xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="t-muted text-xs font-bold uppercase tracking-widest pl-1">Email Address</FormLabel>
              <FormControl>
                <Input placeholder="john@company.com" className="glow-input h-14 rounded-2xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="t-muted text-xs font-bold uppercase tracking-widest pl-1">Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your project..." 
                  className="glow-input min-h-[160px] rounded-2xl resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full h-14 text-base font-bold btn-primary text-white border-0 rounded-2xl gap-2 mt-4"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

