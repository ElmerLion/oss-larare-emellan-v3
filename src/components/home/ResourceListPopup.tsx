import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ResourceCard } from "@/components/resources/ResourceCard";

interface ResourceListPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    resources: any[]; // Replace 'any' with your Resource type if available
}

export function ResourceListPopup({
    open,
    onOpenChange,
    title,
    resources,
}: ResourceListPopupProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {resources.length === 0 ? (
                        <p className="text-center text-gray-500">Inga resurser hittades.</p>
                    ) : (
                        resources.map((resource) => (
                            <div key={resource.id}>
                                <ResourceCard resource={resource} />
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ResourceListPopup;
