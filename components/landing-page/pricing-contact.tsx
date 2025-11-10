"use client";

import { useState } from "react";
import { Check, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BlueLine from "../ui/BlueLine";

export default function PricingContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const pricingPlans = [
    {
      name: "Basic",
      price: "$80-150/hour",
      features: [
        "Studio access during business hours",
        "Basic equipment",
        "Rate depends on usage",
        "Weekday availability",
        "Basic post-production",
      ],
      action: "Book Now",
      highlighted: false,
    },
    {
      name: "Half Day Package",
      price: "Custom",
      features: [
        "Premium studio access",
        "Professional equipment",
        "4-hour block",
        "7-day availability",
        "Advanced post-production",
        "Technical assistance",
      ],
      action: "Book Now",
      highlighted: true,
    },
    {
      name: "Custom Package",
      price: "Request Details",
      features: [
        "Full facility access",
        "All equipment included",
        "Flexible booking",
        "Priority scheduling",
        "Full post-production",
        "Dedicated support team",
        "Distribution assistance",
      ],
      action: "Contact Us",
      highlighted: false,
    },
  ];

  const services = [
    "Content Creation",
    "Podcast Studio",
    "Photography",
    "Video Production",
    "Post-Production",
    "Collaboration Space",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!", {
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pricing & Packages
            </h2>
            <BlueLine width="w-16" className="mb-4" />
            <p className="text-xl text-gray-600">
              Flexible options for every creator
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`${
                  plan.highlighted
                    ? "border-blue-600 border-2 shadow-xl scale-105"
                    : ""
                } hover:shadow-lg transition-all flex flex-col`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-gray-900 mt-2">
                    {plan.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.action}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <BlueLine width="w-16" className="mb-4" />
            <p className="text-xl text-gray-600">
              Ready to create? Get in touch
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">Service Interest</Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) =>
                        handleInputChange("service", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Single Contact Info Card */}
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>
                  
                  <div className="space-y-6">
                    {/* Location */}
                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                        <p className="text-gray-700 text-sm mb-2">
                          6 Shields Court, Unit 204<br />
                          Markham, Ontario L3R 4S1
                        </p>
                        <a
                          href="https://maps.google.com/?q=6+Shields+Court+Unit+204+Markham+Ontario"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                        >
                          Get Directions →
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4 pb-6 border-b border-gray-100">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Phone className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                        <a
                          href="tel:+14165551234"
                          className="text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          (416) 555-1234
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <a
                          href="mailto:TrueMediaOffice@gmail.com"
                          className="text-gray-700 hover:text-blue-600 transition-colors break-all"
                        >
                          TrueMediaOffice@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="overflow-hidden shadow-lg">
                <div className="h-80 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.8888!2d-79.3372!3d43.8561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDUxJzIyLjAiTiA3OcKwMjAnMTQuMCJX!5e0!3m2!1sen!2sca!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    title="TRUE MEDIA Location"
                  />
                </div>
              </Card>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}