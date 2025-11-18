"use client"

import { Plus } from "lucide-react"
import React from "react"

const NavigationAction = () => {
    return (
        <div>
            <button className="group flex items-center">
                <div className="group flex mx-3 h-12 w-12 rounded-3xl 
                    transition-all overflow-hidden items-center justify-center 
                    bg-background dark:bg-neutral-700 
                    group-hover:rounded-2xl group-hover:bg-emerald-500">
                    <Plus
                        className="group-hover:text-white transition text-emerald-500" size={25}
                    />
                </div>
            </button>
        </div>

    )
}

export default NavigationAction