import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );

        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Articles", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(/ArticlesForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-dateAdded");
        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(dateAddedField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/DateAdded is required./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-submit");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/DateAdded is required./);
        expect(screen.getByText(/Title is required./)).toBeInTheDocument();
        expect(screen.getByText(/DateAdded is required./)).toBeInTheDocument();
        expect(screen.getByText(/Url is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-dateAdded");

        const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
        const titleField = screen.getByTestId("ArticlesForm-title");
        const urlField = screen.getByTestId("ArticlesForm-url");
        const explanationField = screen.getByTestId("ArticlesForm-explanation");
        const emailField = screen.getByTestId("ArticlesForm-email");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(dateAddedField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(titleField, { target: { value: 'My Title' } });
        fireEvent.change(urlField, { target: { value: 'latimes.com' } });
        fireEvent.change(explanationField, { target: { value: 'My explanation' } });
        fireEvent.change(emailField, { target: { value: 'email@gmail.com' } });
        
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();

    });

    test("invalid email format", async () => {
        const mockSubmitAction = jest.fn();
        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-dateAdded");

        const emailGet = screen.getByTestId("ArticlesForm-email");
        const submitButton = screen.getByTestId("ArticlesForm-submit");

        fireEvent.change(emailGet, { target: {value: "badformat" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Invalid email address format/)).toBeInTheDocument();
        });
    });
    


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId("ArticlesForm-cancel");
        const cancelButton = screen.getByTestId("ArticlesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


