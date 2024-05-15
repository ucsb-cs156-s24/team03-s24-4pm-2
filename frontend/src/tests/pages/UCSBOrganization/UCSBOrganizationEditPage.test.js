import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

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
            orgCode: "SKY"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "SKY" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBOrganization");
            expect(screen.queryByTestId("UCSBOrganizationForm-orgTranslationShort")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/UCSBOrganization", { params: { orgCode: "SKY" } }).reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB",
                orgTranslation: "SKYDIVING CLUB AT UCSB",
                inactive: false
            });
            axiosMock.onPut('/api/UCSBOrganization').reply(200, {
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB",
                orgTranslation: "SKYDIVING CLUB AT UCSB",
                inactive: true
            });
        });

        const queryClient = new QueryClient();
        // test("renders without crashing", () => {
        //     render(
        //         <QueryClientProvider client={queryClient}>
        //             <MemoryRouter>
        //                 <UCSBOrganizationEditPage />
        //             </MemoryRouter>
        //         </QueryClientProvider>
        //     );
        // });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");

            const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("SKY");
            expect(orgTranslationShortField).toBeInTheDocument();
            expect(orgTranslationShortField).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslationField).toBeInTheDocument();
            expect(orgTranslationField).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactiveField).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShortField, { target: { value: 'SKYDIVING CLUB' } });
            fireEvent.change(orgTranslationField, { target: { value: 'SKYDIVING CLUB AT UCSB' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: SKY orgTranslationShort: SKYDIVING CLUB");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "SKY" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: "SKY",
                orgTranslationShort: "SKYDIVING CLUB",
                orgTranslation: "SKYDIVING CLUB AT UCSB",
                inactive: false
            })); // posted object
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");

            const orgCode = screen.getByTestId("UCSBOrganizationForm-orgCode");
            const orgTranslationShort = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const orgTranslation = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactive = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCode).toHaveValue("SKY");
            expect(orgTranslationShort).toHaveValue("SKYDIVING CLUB");
            expect(orgTranslation).toHaveValue("SKYDIVING CLUB AT UCSB");
            expect(inactive).not.toBeChecked();
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgTranslationShort, { target: { value: 'SKYDIVING CLUB' } })
            fireEvent.change(orgTranslation, { target: { value: 'SKYDIVING CLUB AT UCSB' } })
            fireEvent.change(inactive, { target: { checked: false } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBOrganization Updated - orgCode: SKY orgTranslationShort: SKYDIVING CLUB");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
        });

       
    });
});

