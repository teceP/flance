import { Card } from '@/components/ui/card';
import * as React from 'react';

const GenPage = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">
                    Analytics
                </h1>
            </div>

            <Card className="p-6">
                <div>
                    This is a Card!
                </div>
            </Card>
        </div>
    )
}

export default GenPage;
