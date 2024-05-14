import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {

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
                    <ArticlesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /articles", async () => {

    const queryClient = new QueryClient();
    const article = {
        id: 3,
        title: "Article on Subway",
        url: "latimes.com",
        explanation: "all about subway",
        email: "gaucho@gmail.com",
        dateAdded: '2022-01-02T12:00:00'
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <ArticlesCreatePage />
            </MemoryRouter>
        </QueryClientProvider>
    )

    await waitFor(() => {
        expect(screen.getByLabelText("Url")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("Title");
    expect(titleInput).toBeInTheDocument();

    const urlInput = screen.getByLabelText("Url");
    expect(urlInput).toBeInTheDocument();

    const explanationInput = screen.getByLabelText("Explanation");
    expect(explanationInput).toBeInTheDocument();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();

    const dateAddedInput = screen.getByLabelText("Date (iso format)");
    expect(dateAddedInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "Article on Subway 2" } })
    fireEvent.change(urlInput, { target: { value: "cs156.com" } })
    fireEvent.change(explanationInput, { target: { value: "all about subway 2" } })
    fireEvent.change(emailInput, { target: { value: "kflippo@email.com" } })
    fireEvent.change(dateAddedInput, { target: { value: '2021-07-04T12:01:10' } })
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
        title: "Article on Subway 2",
        url: "cs156.com",
        explanation: "all about subway 2",
        email: "kflippo@email.com",
        dateAdded: '2021-07-04T12:01:10.000'
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith("New article Created - id: 3 title: Article on Subway");
    expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

    });
});


