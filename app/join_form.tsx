import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Checkbox, Input} from "@nextui-org/react";
import styles from './page.module.scss'

	/*
    "first_name": "John",
    "last_name": "Smith",
    "email": "jsmith@gmail.com",
    "phone": "+1585-758-3425",  # CSH's phone number :P
    "street_address": "151 Broome St",  # Also covers New York County Test Case
    "city": "New York",
    "state": "NY",
    "zip": 10002,
    "apartment": "",
    "roof_access": True,
    "referral": "Googled it or something IDK",
	*/

const JoinForm = () => {
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["State"]));

	const selectedValue = React.useMemo(
	  () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
	  [selectedKeys]
	);

    return (
		<form>
            <div className={styles.formSection}>
                <h2>Personal Info</h2>
                <div className={styles.horizontal}>
                    <Input type="text" label="first_name" placeholder="First Name" className="px-unit-3 py-unit-3" />
                    <Input type="text" label="last_name" placeholder="Last Name" className="px-unit-3 py-unit-3" />
                </div>
                <Input type="email" label="email" placeholder="Enter your email" className="px-unit-3 py-unit-3" />
                <Input type="text" label="phone" placeholder="Phone Number" className="px-unit-3 py-unit-3" />
            </div>

            <div className={styles.formSection}>
                <h2>Address Info</h2>
                <div className={styles.horizontal}>
                    <Input type="text" label="street_address" placeholder="Street Address" className="px-unit-3 py-unit-3" />
                    <Input type="text" label="apartment" placeholder="Unit #" className="px-unit-3 py-unit-3" />
                </div>

                <div className={styles.horizontal}>
                    <Input type="text" label="city" placeholder="City" className="px-unit-3 py-unit-3" />
                    <Input type="text" label="zip" placeholder="Zip Code" className="px-unit-3 py-unit-3" />
                </div>

                    
                {/* TODO: How to style this guy? */}
                <div className={styles.centerIGuess}>
                    <Dropdown>
                    <DropdownTrigger>
                        <Button variant="bordered" className="capitalize">
                        {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Single selection example"
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key="NY">New York</DropdownItem>
                        <DropdownItem key="NJ">New Jersey</DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </div>
            </div>

            <div className={styles.formSection}>
                <h2>Etc.</h2>
                <div className={styles.centerIGuess}>
                <Checkbox className={"px-unit-3 py-unit-3"}>Do you have roof access?</Checkbox></div>
                <Input type="text" label="referral" placeholder="How did you hear about NYC Mesh?" className="px-unit-3 py-unit-3" />
            </div>

            <div className={styles.formSection}>
                <div className={styles.centerIGuess}>
                    <Button>Submit</Button>
                </div>
            </div>
        </form>
    )
}

export default JoinForm
