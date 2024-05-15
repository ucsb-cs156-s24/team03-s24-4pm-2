import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "Freebirds article",
                url: "freebirds.com",
                explanation: "Burritos yum",
                email: "freebirds@gmail.com",
                dateAdded: '2021-07-04T12:01:10'
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: 17,
                title: "Freebirds world burrito article",
                url: "freebirdsabc.com",
                explanation: "Burritos 123 yum",
                email: "freebirdsabc@gmail.com",
                dateAdded: '2031-07-04T12:01:10'
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(titleField).toBeInTheDocument();
            expect(titleField).toHaveValue("Freebirds article");
            expect(urlField).toBeInTheDocument();
            expect(urlField).toHaveValue("freebirds.com");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("Burritos yum");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("freebirds@gmail.com");
            expect(dateAddedField).toBeInTheDocument();
            expect(dateAddedField).toHaveValue('2021-07-04T12:01:10.000');

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(titleField, { target: { value: 'Freebirds world burrito article' } });
            fireEvent.change(urlField, { target: { value: 'freebirdsabc.com' } });
            fireEvent.change(explanationField, { target: { value: 'Burritos 123 yum' } });
            fireEvent.change(emailField, { target: { value: 'freebirdsabc@gmail.com' } });
            fireEvent.change(dateAddedField, { target: { value: '2031-07-04T12:01:10' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: Freebirds world burrito article");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: 'Freebirds world burrito article',
                url: 'freebirdsabc.com',
                explanation: 'Burritos 123 yum',
                email: 'freebirdsabc@gmail.com',
                dateAdded: '2031-07-04T12:01:10.000'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Freebirds article");
            expect(urlField).toHaveValue("freebirds.com");
            expect(explanationField).toHaveValue("Burritos yum");
            expect(emailField).toHaveValue("freebirds@gmail.com");
            expect(dateAddedField).toHaveValue('2021-07-04T12:01:10.000');
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'Freebirds world burrito article' } });
            fireEvent.change(urlField, { target: { value: 'freebirdsabc.com' } });
            fireEvent.change(explanationField, { target: { value: 'Burritos 123 yum' } });
            fireEvent.change(emailField, { target: { value: 'freebirdsabc@gmail.com' } });
            fireEvent.change(dateAddedField, { target: { value: '2031-07-04T12:01:10' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: Freebirds world burrito article");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
        });

       
    });
});
