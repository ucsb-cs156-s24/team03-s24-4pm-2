import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Item Id", "Comment", "Email", "Stars","Date Reviewed" ];
    const testId = "MenuItemReviewForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneReview} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId(`${testId}-submit`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.click(submitButton);

        await screen.findByText(/itemId is required/);
        expect(screen.getByText(/Comment is required/)).toBeInTheDocument();
        expect(screen.getByText(/reviewerEmail is required/)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
        expect(screen.getByText(/reviewerEmail is required/)).toBeInTheDocument();

    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/itemId is required/);
        expect(screen.getByText(/Comment is required/)).toBeInTheDocument();
        expect(screen.getByText(/reviewerEmail is required/)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
        expect(screen.getByText(/reviewerEmail is required/)).toBeInTheDocument();
        expect(screen.getByText(/dateReviewed in iso format is required/)).toBeInTheDocument();


        const nameInput2 = screen.getByTestId(`${testId}-star`);
        fireEvent.change(nameInput2, { target: { value: "10" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Number must be <= 5/)).toBeInTheDocument();
        });

        const nameInput3 = screen.getByTestId(`${testId}-star`);
        fireEvent.change(nameInput3, { target: { value: "0" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Number must be >= 1/)).toBeInTheDocument();
        });
        const nameInput4 = screen.getByTestId(`${testId}-itemId`);
        fireEvent.change(nameInput4, { target: { value: "0" } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Id must be >= 1/)).toBeInTheDocument();
        });

        const commentGet = screen.getByTestId(`${testId}-comments`)
        fireEvent.change(commentGet, { target: { value: "" } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Comment is required./)).toBeInTheDocument();
        });

        const emailGet = screen.getByTestId(`${testId}-reviewerEmail`)
        fireEvent.change(emailGet, { target: { value: "hi Lol" } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/Invalid email address format/)).toBeInTheDocument();
        });

        const dateGet = screen.getByTestId(`${testId}-dateReviewed`)
        fireEvent.change(dateGet, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText(/dateReviewed in iso format is required/)).toBeInTheDocument();
        });

    });

});