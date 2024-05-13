import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 3
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 3 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Review");
            expect(screen.queryByTestId("MenuItemReview-itemId")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreviews", { params: { id: 3 } }).reply(200, {
                id: 3,
                itemId: 1,
                star: 2,
                dateReviewed: '2023-07-04T12:00:00',
                reviewerEmail: "reviewer1@gmail.com",
                comments: "Kinda bad"
            });
            axiosMock.onPut('/api/menuitemreviews').reply(200, {
                id: 3,
                itemId: 2,
                star: 3,
                dateReviewed: '2024-07-04T12:00:00',
                reviewerEmail: "reviewer2@gmail.com",
                comments: "meh"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const starField = screen.getByTestId("MenuItemReviewForm-star");
            const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("3");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue(1);
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("Kinda bad");
            expect(starField).toBeInTheDocument();
            expect(starField).toHaveValue(2);
            expect(dateField).toBeInTheDocument();
            expect(dateField).toHaveValue("2023-07-04T12:00");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("reviewer1@gmail.com");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(itemIdField, { target: { value: 2 } });
            fireEvent.change(commentsField, { target: { value: 'meh' } });
            fireEvent.change(starField, { target: { value: 3 } });
            fireEvent.change(dateField, { target: { value: '2024-07-04T12:00:00' } });
            fireEvent.change(emailField, { target: { value: 'reviewer2@gmail.com' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu item review Updated - id: 3 itemId: 2");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                itemId: "2",
                reviewerEmail: "reviewer2@gmail.com",
                star: "3",
                comments: "meh",
                dateReviewed: '2024-07-04T12:00',
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
            const starField = screen.getByTestId("MenuItemReviewForm-star");
            const dateField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const emailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
            
            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("3");
            expect(itemIdField).toBeInTheDocument();
            expect(itemIdField).toHaveValue(1);
            expect(commentsField).toBeInTheDocument();
            expect(commentsField).toHaveValue("Kinda bad");
            expect(starField).toBeInTheDocument();
            expect(starField).toHaveValue(2);
            expect(dateField).toBeInTheDocument();
            expect(dateField).toHaveValue("2023-07-04T12:00");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("reviewer1@gmail.com");

            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(itemIdField, { target: { value: 2 } });
            fireEvent.change(commentsField, { target: { value: 'meh' } });
            fireEvent.change(starField, { target: { value: 3 } });
            fireEvent.change(dateField, { target: { value: '2024-07-04T12:00:00' } });
            fireEvent.change(emailField, { target: { value: 'reviewer2@gmail.com' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Menu item review Updated - id: 3 itemId: 2");
            expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });
        });

       
    });
});
