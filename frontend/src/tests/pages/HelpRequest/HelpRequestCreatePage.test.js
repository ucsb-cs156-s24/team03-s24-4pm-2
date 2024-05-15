import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
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
describe("HelpRequestCreatePage tests", () => {

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
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 1,
            requesterEmail: "easakawa@ucsb.edu",
            teamId: "s24-4pm-2",
            tableOrBreakoutRoom: "7",
            requestTime: "2022-01-02T12:00:00",
            explanation: "Lost my computer",
            solved: false
        };

        axiosMock.onPost("/api/HelpRequest/post").reply(202, helpRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
        });

        const requesterEmailInput = screen.getByLabelText("Requester Email");
        expect(requesterEmailInput).toBeInTheDocument();

        const teamIdInput = screen.getByLabelText("Team Id");
        expect(teamIdInput).toBeInTheDocument();

        const tableOrBreakoutRoomInput = screen.getByLabelText("Table Or Breakout Room");
        expect(tableOrBreakoutRoomInput).toBeInTheDocument();

        const requestTimeInput = screen.getByLabelText("Request Time (iso format)");
        expect(requestTimeInput).toBeInTheDocument();

        const explanationInput = screen.getByLabelText("Explanation");
        expect(explanationInput).toBeInTheDocument();

        const solvedInput = screen.getByLabelText("Solved");
        expect(solvedInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmailInput, { target: { value: 'evan@ucsb.edu' } });
        fireEvent.change(teamIdInput, { target: { value: 's25-4pm-2' } });
        fireEvent.change(requestTimeInput, { target: { value: '2023-01-02T12:00' } });
        fireEvent.change(tableOrBreakoutRoomInput, {target:{value:'table 3'}});
        fireEvent.change(explanationInput, { target: {value: 'Stubbed my toe owieeeieeieie'}});
        fireEvent.click(solvedInput);

        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "evan@ucsb.edu",
            teamId: "s25-4pm-2",
            tableOrBreakoutRoom: "table 3",
            requestTime: "2023-01-02T12:00",
            explanation: "Stubbed my toe owieeeieeieie",
            solved: true
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New help request Created - id: 1 requester email: easakawa@ucsb.edu");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});


