/*
 *  This file is part of the Jikes RVM project (http://jikesrvm.org).
 *
 *  This file is licensed to You under the Eclipse Public License (EPL);
 *  You may not use this file except in compliance with the License. You
 *  may obtain a copy of the License at
 *
 *      http://www.opensource.org/licenses/eclipse-1.0.php
 *
 *  See the COPYRIGHT.txt file distributed with this work for information
 *  regarding copyright ownership.
 */
package test.org.jikesrvm.basic.bugs;

import gnu.testlet.TestHarness;
import gnu.testlet.Testlet;

/**
 * Test code demonstrating bug [ 1657236 ] Converting -0.0F to a string does not work in Opt compiler.
 * <p/>
 * Should be tested with -X:aos:initial_compiler=opt in at least one test-configuration.
 */
public class R1657236 implements Testlet {
  public int getExpectedPass() { return 1; }
  public int getExpectedFail() { return 0; }
  public int getExpectedKnownFail() { return 0; }
  public void test(TestHarness th) {
    th.check(Float.toString(-0F), "-0.0");
  }
}
