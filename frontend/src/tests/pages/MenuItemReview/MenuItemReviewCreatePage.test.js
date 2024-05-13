import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /menuitemreviews", async () => {

        const queryClient = new QueryClient();
        const menuitemreview = {
            id: 3,
            itemId: 1,
            star: 2,
            dateReviewed: '2023-07-04T12:00:00',
            reviewerEmail: "reviewer1@gmail.com",
            comments: "Kinda bad"
        };

        axiosMock.onPost("/api/menuitemreviews/post").reply(202, menuitemreview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("Item Id");
        expect(itemIdInput).toBeInTheDocument();

        const commentInput = screen.getByLabelText("Comment");
        expect(commentInput).toBeInTheDocument();

        const starsInput = screen.getByLabelText("Stars");
        expect(starsInput).toBeInTheDocument();

        const emailInput = screen.getByLabelText("Email");
        expect(emailInput).toBeInTheDocument();

        const dateInput = screen.getByLabelText("Date Reviewed");
        expect(dateInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: 5 } })
        fireEvent.change(commentInput, { target: { value: "Very interesting" } })
        fireEvent.change(starsInput, { target: { value: 4 } })
        fireEvent.change(emailInput, { target: { value: "reviewer6@gmail.com" } })
        fireEvent.change(dateInput, { target: { value: '2021-07-04T12:00:00' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            itemId: "5",
            star: "4",
            dateReviewed: '2021-07-04T12:00',
            reviewerEmail: "reviewer6@gmail.com",
            comments: "Very interesting"
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New menu item review Created - id: 3 itemId: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreviews" });

    });
});




