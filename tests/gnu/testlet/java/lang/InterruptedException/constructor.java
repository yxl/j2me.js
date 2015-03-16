// Test if instances of a class java.lang.InterruptedException could be properly constructed

// Copyright (C) 2012 Pavel Tisnovsky <ptisnovs@redhat.com>

// This file is part of Mauve.

// Mauve is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2, or (at your option)
// any later version.

// Mauve is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Mauve; see the file COPYING.  If not, write to
// the Free Software Foundation, Inc., 51 Franklin Street,
// Fifth Floor, Boston, MA 02110-1301 USA.

package gnu.testlet.java.lang.InterruptedException;

import gnu.testlet.TestHarness;
import gnu.testlet.Testlet;

import java.lang.InterruptedException;



/**
 * Test if instances of a class java.lang.InterruptedException
 * could be properly constructed
 */
public class constructor implements Testlet
{
  public int getExpectedPass() { return 6; }
  public int getExpectedFail() { return 0; }
  public int getExpectedKnownFail() { return 0; }

    /**
     * Runs the test using the specified harness.
     *
     * @param harness  the test harness (<code>null</code> not permitted).
     */
    public void test(TestHarness harness)
    {
        InterruptedException object1 = new InterruptedException();
        harness.check(object1 != null);
        harness.check(object1.toString(), "java.lang.InterruptedException");

        InterruptedException object2 = new InterruptedException("nothing happens");
        harness.check(object2 != null);
        harness.check(object2.toString(), "java.lang.InterruptedException: nothing happens");

        InterruptedException object3 = new InterruptedException(null);
        harness.check(object3 != null);
        harness.check(object3.toString(), "java.lang.InterruptedException");

    }
}

