
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
                rohum: {
                    purple: '#2D0C57',
                    blue: '#4F46E5',
                    pink: '#FF2D92',
                    darkBg: '#0F0B14',
                    lightBg: '#F9FAFB',
                    gray: '#64748B'
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'pulse-glow': {
                    '0%, 100%': { 
                        opacity: '1',
                        boxShadow: '0 0 10px rgba(79, 70, 229, 0.7)'
                    },
                    '50%': { 
                        opacity: '0.7',
                        boxShadow: '0 0 25px rgba(79, 70, 229, 0.9)'
                    }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                'gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
                'float': 'float 6s infinite ease-in-out',
                'gradient-shift': 'gradient-shift 15s ease infinite'
			},
            backgroundImage: {
                'hero-pattern': 'linear-gradient(to right bottom, rgba(45, 12, 87, 0.9), rgba(79, 70, 229, 0.8))',
                'glow-gradient': 'radial-gradient(circle at center, rgba(79, 70, 229, 0.3) 0%, rgba(255, 45, 146, 0.1) 70%, transparent 100%)'
            }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
