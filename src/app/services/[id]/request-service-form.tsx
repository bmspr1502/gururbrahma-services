"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { requestServiceAction } from "./actions";
import { FormSchema } from "./schema";
import { useLanguage } from "@/context/language-context";
import { RASHI_DATA } from "@/lib/astrology-data";
import type { ServiceCategory } from "@/lib/types";

type RequestServiceFormProps = {
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
};

export function RequestServiceForm({ serviceId, serviceName, category }: RequestServiceFormProps) {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serviceId,
      serviceName,
      name: "",
      email: "",
      phone: "",
      preferredDate: undefined,
      preferredTime: "",
      description: "",
      rashiNakshatra: "",
      language,
    },
  });

  // Keep language in sync with context
  useEffect(() => {
    form.setValue("language", language);
  }, [language, form]);

  const [selectedRashi, setSelectedRashi] = useState<string>("");
  const [selectedNakshatra, setSelectedNakshatra] = useState<string>("");

  // Sync rashiNakshatra field when dropdowns change
  useEffect(() => {
    if (selectedRashi && selectedNakshatra) {
      const rashi = RASHI_DATA.find(r => r.id === selectedRashi);
      const nakshatra = rashi?.nakshatras.find(n => n.id === selectedNakshatra);
      
      if (rashi && nakshatra) {
        // We store the display string in rashiNakshatra for the inquiry details
        const combined = `${rashi[language]} - ${nakshatra[language]}`;
        form.setValue("rashiNakshatra", combined);
      }
    } else {
      form.setValue("rashiNakshatra", "");
    }
  }, [selectedRashi, selectedNakshatra, language, form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const result = await requestServiceAction(data);

    if (result.success) {
      toast({
        title: t('inquiry_sent_title'),
        description: t('inquiry_sent_desc'),
      });
      form.reset();
      setSelectedRashi("");
      setSelectedNakshatra("");
    } else {
      toast({
        variant: "destructive",
        title: t('something_went_wrong'),
        description: result.message || t('inquiry_error_desc'),
      });
    }
  }

  const currentRashi = RASHI_DATA.find(r => r.id === selectedRashi);
  const showAstrologyFields = category !== "Teaching";

  return (
    <Card className="shadow-xl bg-card/90 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle>{t('request_service')}</CardTitle>
        <CardDescription>
          {t('request_service_desc').replace('{serviceName}', serviceName)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    {t('full_name')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('full_name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    {t('email_address')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="yourname@example.com" {...field} />
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
                  <FormLabel className="flex items-center gap-1">
                    {t('phone_number')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('phone_number')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1">
                    {t('preferred_date')} <span className="text-destructive">*</span>
                  </FormLabel>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal border-primary/20 hover:border-primary/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>{t('pick_a_date')}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    {t('preferred_time')} <span className="text-destructive">*</span>
                  </FormLabel>
                   <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('details_label')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('details_placeholder')} 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showAstrologyFields && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel>{t('rashi_label')}</FormLabel>
                  <Select value={selectedRashi} onValueChange={(val) => {
                    setSelectedRashi(val);
                    setSelectedNakshatra(""); // Reset nakshatra when rashi changes
                  }}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_rashi')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RASHI_DATA.map((rashi) => (
                        <SelectItem key={rashi.id} value={rashi.id}>
                          {rashi[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>

                <FormItem>
                  <FormLabel>{t('nakshatra_label')}</FormLabel>
                  <Select 
                    value={selectedNakshatra} 
                    onValueChange={setSelectedNakshatra}
                    disabled={!selectedRashi}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_nakshatra')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentRashi?.nakshatras.map((nakshatra) => (
                        <SelectItem key={nakshatra.id} value={nakshatra.id}>
                          {nakshatra[language]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              </div>
            )}

            <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('sending') : t('send_inquiry')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
