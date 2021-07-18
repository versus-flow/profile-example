// File: ./src/flow/fetch-profile.script.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function fetchProfile(address) {
  if (address == null) return null

  return fcl
    .send([
      fcl.script`
        import Profile from 0xProfile

        pub fun main(address: Address): &{Profile.Public}? {
          return getAccount(address)
        .getCapability<&{Profile.Public}>(Profile.publicPath)
        .borrow()
    }

      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}

