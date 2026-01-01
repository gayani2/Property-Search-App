import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('PropertySearchApp', () => {
    const mockProperties = [
        {
            id: "prop1",
            type: "House",
            bedrooms: 3,
            price: 750000,
            tenure: "Freehold",
            description: "Attractive three bedroom semi-detached family home",
            longDescription: "Attractive three bedroom semi-detached family home situated within 0.5 miles of Petts Wood station",
            location: "Petts Wood Road, Petts Wood, Orpington BR5",
            added: { month: "October", day: 12, year: 2022 },
            images: ["images/prop1pic1.jpg", "images/prop1pic2.jpg"],
            floorPlan: "/images/prop1floorplan.jpg"
        },
        {
            id: "prop2",
            type: "Flat",
            bedrooms: 2,
            price: 399995,
            tenure: "Freehold",
            description: "Presented in excellent decorative order throughout",
            longDescription: "Presented in excellent decorative order throughout is this two double bedroom flat",
            location: "Crofton Road Orpington BR6",
            added: { month: "September", day: 14, year: 2022 },
            images: ["images/prop2pic1.jpg"],
            floorPlan: "/images/prop2floorplan.jpg"
        }
    ];

    beforeEach(() => {
        // Mock fetch API
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ properties: mockProperties })
            })
        );

        // Mock localStorage
        const localStorageMock = {
            getItem: vi.fn(() => null),
            setItem: vi.fn(),
            clear: vi.fn()
        };
        global.localStorage = localStorageMock;
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    // Test 1: Loading state
    test('shows loading message before properties load', () => {
        render(<App />);
        expect(screen.getByText(/Loading properties/i)).toBeInTheDocument();
    });

    // Test 2: Error handling
    test('shows error message when property fetch fails', async () => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: false,
                statusText: 'Not Found'
            })
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Failed to load properties/i)).toBeInTheDocument();
        });
    });

    // Test 3: Successful property loading
    test('displays properties after successful fetch', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/2 Properties Found/i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    // Test 4: Add and remove favourites
    test('adds and removes a favourite', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/Favourites \(0\)/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        // Find heart button by looking for the heart icon class
        const propertyCards = screen.getAllByRole('button');
        const heartButton = propertyCards.find(btn =>
            btn.className.includes('heart-button')
        );

        if (heartButton) {
            // Add to favourites
            fireEvent.click(heartButton);

            await waitFor(() => {
                expect(screen.getByText(/Favourites \(1\)/i)).toBeInTheDocument();
            });

            // Remove from favourites
            fireEvent.click(heartButton);

            await waitFor(() => {
                expect(screen.getByText(/Favourites \(0\)/i)).toBeInTheDocument();
            });
        }
    });

    // Test 5: Property detail view and tabs
    test('opens property detail and shows floorplan tab content', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/2 Properties Found/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        const viewButtons = screen.getAllByRole('button', { name: /View Details/i });
        fireEvent.click(viewButtons[0]);

        await waitFor(() => {
            expect(screen.getByText(/Back to Search/i)).toBeInTheDocument();
        });

        // Click on Floor Plan tab
        const floorPlanTab = screen.getByRole('button', { name: /Floor Plan/i });
        fireEvent.click(floorPlanTab);

        await waitFor(() => {
            expect(screen.getByAltText(/Floor Plan/i)).toBeInTheDocument();
        });
    });

    // Test 6: Footer rendering
    test('renders footer with correct information', async () => {
        render(<App />);

        await waitFor(() => {
            expect(screen.getByText(/© 2025 Property Search. All rights reserved./i)).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});