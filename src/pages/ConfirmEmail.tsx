import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ConfirmEmail() {
    return (
        <>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm text-center">
                    <h1 className="text-3xl font-bold mb-4">Bekräfta din e-post</h1>
                    <p className="text-gray-700 mb-6">
                        Tack för att du registrerade dig! Ett bekräftelsemail har skickats till din e-postadress.
                        Var god kontrollera din inkorg (och spam-mappen) för att bekräfta ditt konto.
                    </p>
                    <Link to="/login">
                        <Button variant="primary" className="w-full">
                            Gå till inloggning
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}
